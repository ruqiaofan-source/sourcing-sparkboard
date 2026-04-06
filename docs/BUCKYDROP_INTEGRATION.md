# BuckyDrop Integration Guide

## Overview

Equilinq integrates with BuckyDrop to sync order fulfillment. Two edge functions handle the integration:

| Function | Purpose |
|---|---|
| `buckydrop-sync` | Push orders to BuckyDrop & pull status updates |
| `buckydrop-webhook` | Receive real-time status updates from BuckyDrop |

A **cron job** runs every 15 minutes to automatically pull status updates (in addition to real-time webhooks).

---

## Setup Steps

### 1. Get BuckyDrop API Credentials

1. Log in to your BuckyDrop admin dashboard
2. Navigate to **Settings > API** (or contact BuckyDrop support at marketing@buckydrop.com)
3. Generate an API key
4. Note the API base URL (e.g. `https://api.buckydrop.com/v1`)

### 2. Add Secrets to Lovable

Add these three secrets via **Lovable > Settings > Secrets**:

| Secret Name | Value | Required |
|---|---|---|
| `BUCKYDROP_API_KEY` | Your BuckyDrop API key | Yes |
| `BUCKYDROP_API_URL` | API base URL (default: `https://api.buckydrop.com/v1`) | Yes |
| `BUCKYDROP_WEBHOOK_SECRET` | Shared secret for webhook verification | Yes |

### 3. Configure BuckyDrop Webhook

In BuckyDrop's dashboard, set the webhook URL to:

```
https://chmoabjmtbbqdrgigspm.supabase.co/functions/v1/buckydrop-webhook
```

Set the webhook secret to the same value you used for `BUCKYDROP_WEBHOOK_SECRET`.

---

## Database Schema

The `orders` table has these BuckyDrop-specific columns:

| Column | Type | Description |
|---|---|---|
| `buckydrop_order_id` | text (unique) | BuckyDrop's internal order ID |
| `buckydrop_tracking_number` | text | Shipping tracking number from BuckyDrop |
| `buckydrop_status` | text | Raw status from BuckyDrop |
| `buckydrop_synced_at` | timestamptz | Last sync timestamp |

---

## Example Payloads

### Push Order -- Request to `buckydrop-sync`

```json
{
  "action": "push",
  "order_id": "a1b2c3d4-5678-90ab-cdef-1234567890ab"
}
```

### Push Order -- Outgoing payload TO BuckyDrop (POST /orders)

```json
{
  "external_order_id": "EQ-20240315-001",
  "product_name": "Custom Silicone Phone Case",
  "quantity": 500,
  "total_amount": 2450.00,
  "notes": "Pantone 186C red, matte finish"
}
```

### Push Order -- Expected BuckyDrop response

```json
{
  "order_id": "BD-88001",
  "status": "pending",
  "created_at": "2024-03-15T10:30:00Z"
}
```

### Pull Statuses -- Request to `buckydrop-sync`

```json
{
  "action": "pull"
}
```

### Pull Statuses -- Expected BuckyDrop response per order (GET /orders/:id)

```json
{
  "order_id": "BD-88001",
  "status": "shipped",
  "tracking_number": "SF1234567890",
  "carrier": "SF Express",
  "estimated_delivery": "2024-04-02T00:00:00Z",
  "updated_at": "2024-03-25T14:22:00Z"
}
```

### Webhook -- Incoming payload from BuckyDrop

```json
{
  "event": "order.status_changed",
  "order_id": "BD-88001",
  "external_order_id": "EQ-20240315-001",
  "status": "shipped",
  "tracking_number": "SF1234567890",
  "carrier": "SF Express",
  "estimated_delivery": "2024-04-02T00:00:00Z",
  "updated_at": "2024-03-25T14:22:00Z"
}
```

---

## API Usage

### Push an order to BuckyDrop

```typescript
import { supabase } from "@/integrations/supabase/client";

const { data, error } = await supabase.functions.invoke("buckydrop-sync", {
  body: { action: "push", order_id: "uuid-of-order" },
});
// Success: { success: true, buckydrop_order_id: "BD-88001" }
// Already synced: { skipped: true, message: "Order already synced to BuckyDrop", buckydrop_order_id: "BD-88001" }
```

### Pull all order statuses from BuckyDrop

```typescript
const { data, error } = await supabase.functions.invoke("buckydrop-sync", {
  body: { action: "pull" },
});
// Returns: { updated: 5, total: 12 }
```

### Webhook (automatic)

BuckyDrop sends POST requests to the webhook URL automatically when order statuses change. No frontend code needed.

---

## Status Mapping

These are the default mappings. **Update in both edge functions** once you have BuckyDrop's actual status values:

| BuckyDrop Status | Equilinq Status |
|---|---|
| `pending` | `processing` |
| `processing` | `processing` |
| `purchased` | `processing` |
| `shipped` | `in_transit` |
| `in_transit` | `in_transit` |
| `delivered` | `delivered` |
| `quality_check` | `qc_review` |
| `cancelled` | `processing` |

---

## Polling Cron Job

A `pg_cron` job named `buckydrop-pull-statuses` runs every **15 minutes** and calls `buckydrop-sync` with `{ action: "pull" }`. This ensures statuses stay in sync even if a webhook is missed.

To check the cron job status:
```sql
SELECT * FROM cron.job WHERE jobname = 'buckydrop-pull-statuses';
```

To view recent runs:
```sql
SELECT * FROM cron.job_run_details WHERE jobid = (
  SELECT jobid FROM cron.job WHERE jobname = 'buckydrop-pull-statuses'
) ORDER BY start_time DESC LIMIT 10;
```

---

## TODO for Developers

All `TODO` comments in the edge functions mark spots that need real BuckyDrop API details:

1. **`buckydrop-sync/index.ts`**:
   - [ ] Confirm auth header format (Bearer token? API key header? X-API-Key?)
   - [ ] Adjust POST `/orders` endpoint path
   - [ ] Map order payload fields to BuckyDrop's schema (add shipping_address, sku, etc.)
   - [ ] Adjust response field names (`result.order_id`, etc.)
   - [ ] Map GET `/orders/:id` response fields

2. **`buckydrop-webhook/index.ts`**:
   - [ ] Confirm webhook verification method (header, signature, HMAC, etc.)
   - [ ] Map incoming payload field names to match actual BuckyDrop webhook shape
   - [ ] Update status mapping with confirmed BuckyDrop status values
   - [ ] Decide on cancellation handling (currently maps to `processing`)

3. **General**:
   - [x] ~~Set up cron job for polling~~ (done -- runs every 15 min)
   - [ ] Add `BUCKYDROP_API_KEY`, `BUCKYDROP_API_URL`, and `BUCKYDROP_WEBHOOK_SECRET` secrets

---

## Architecture

```
Equilinq                          BuckyDrop
  |                                   |
  |-- POST buckydrop-sync (push) ---->|  Create order
  |                                   |
  |<-- POST buckydrop-webhook --------|  Status update (real-time)
  |                                   |
  |-- POST buckydrop-sync (pull) ---->|  Batch status check (every 15 min via cron)
  |<-- Response ----------------------|
```

## File Locations

| File | Purpose |
|---|---|
| `supabase/functions/buckydrop-sync/index.ts` | Push/pull sync function with inline payload examples |
| `supabase/functions/buckydrop-webhook/index.ts` | Webhook receiver with inline payload examples |
| `docs/BUCKYDROP_INTEGRATION.md` | This file |
