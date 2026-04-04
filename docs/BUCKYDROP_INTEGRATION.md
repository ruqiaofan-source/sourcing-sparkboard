# BuckyDrop Integration Guide

## Overview

Equilinq integrates with BuckyDrop to sync order fulfillment. Two edge functions handle the integration:

| Function | Purpose |
|---|---|
| `buckydrop-sync` | Push orders to BuckyDrop & pull status updates |
| `buckydrop-webhook` | Receive real-time status updates from BuckyDrop |

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

## API Usage

### Push an order to BuckyDrop

```typescript
import { supabase } from "@/integrations/supabase/client";

const { data, error } = await supabase.functions.invoke("buckydrop-sync", {
  body: { action: "push", order_id: "uuid-of-order" },
});
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

---

## TODO for Developers

All `TODO` comments in the edge functions mark spots that need real BuckyDrop API details:

1. **`buckydrop-sync/index.ts`**:
   - [ ] Confirm auth header format (Bearer token? API key header?)
   - [ ] Adjust POST `/orders` endpoint path
   - [ ] Map order payload fields to BuckyDrop's schema
   - [ ] Adjust response field names (`result.order_id`, etc.)
   - [ ] Map GET `/orders/:id` response fields

2. **`buckydrop-webhook/index.ts`**:
   - [ ] Confirm webhook verification method (header, signature, etc.)
   - [ ] Map incoming payload field names
   - [ ] Update status mapping

3. **Scheduling** (optional):
   - Set up a cron job to call `buckydrop-sync` with `{ action: "pull" }` every 15 minutes
   - Or rely solely on webhooks for real-time updates

---

## Architecture

```
Equilinq                          BuckyDrop
  |                                   |
  |-- POST buckydrop-sync (push) ---->|  Create order
  |                                   |
  |<-- POST buckydrop-webhook --------|  Status update
  |                                   |
  |-- POST buckydrop-sync (pull) ---->|  Batch status check
  |<-- Response ----------------------|
```
