## Goal

Let agents build and send a sourcing quote without leaving the request chat. The quote arrives in the customer's chat as a rich card (Accept / Reject inline + "View details") and stays linked to the request from both sides of the dashboard.

---

## 1. Data model

Add a lightweight link between a chat message and a quote so a single chat row can render as a quote card.

`messages` table (additive, no breaking change):
- `message_type` text, default `'text'` — values: `'text' | 'quote'`
- `quote_id` uuid nullable — points to `quotes.id`

RLS stays the same (existing message policies already cover read/insert by participants). The quote itself still lives in `quotes` with its existing rules, so the customer's "accept/reject" path is unchanged.

---

## 2. Agent flow — "+ Quote" in chat composer

In `RequestChat` (used on `/agent/requests/:id`, `/agent/messages`, `/customer/...`):
- When `isCustomer === false`, render a "+ Quote" button beside the attach/send icons.
- Clicking opens a slide-in panel (Sheet) with the same fields used today in `AgentRequestDetail`: factory name, factory cost, logistics cost, service fee, currency, delivery days, MOQ, notes, optional attachments.
- Live total calculation and validation mirror the existing form.
- On "Send quote":
  1. Insert into `quotes` (status `pending`, agent_id = current user).
  2. Update `sourcing_requests.status` → `quoted`, set `agent_id`.
  3. Insert one row into `messages` with `message_type='quote'`, `quote_id=<new id>`, `content` = short summary (used as a fallback when the card can't load).
  4. Trigger the same customer + admin notifications already fired by the page form.
- All four steps wrapped so a failure rolls the message back (delete the inserted quote if the message fails, and vice-versa) to avoid orphan rows.

---

## 3. Customer view of the quote message

In `RequestChat`, when a message has `message_type='quote'`:
- Render a `QuoteMessageCard` instead of the regular text bubble.
- Card shows: factory name, total, currency, MOQ, delivery days, attachments (signed URLs from existing storage helper).
- Customer-only actions on the card:
  - **Accept** — calls existing `accept-quote` edge function (same path as today).
  - **Reject** — updates `quotes.status = 'rejected'` (same path as today).
  - **View details** — `<Link>` to `/sourcing-requests/:id` so the full request page opens.
- Agent/admin viewing the same card see a read-only version with status badge (Pending / Accepted / Rejected) and the same "View details" link to `/agent/requests/:id`.
- After accept/reject, the card live-updates via the existing realtime channel (we already subscribe to messages, and we'll subscribe to `quotes` updates scoped to this request).

---

## 4. Request ↔ Chat linking

Customer dashboard:
- `/sourcing-requests/:id` (CustomerRequestDetail) already embeds `RequestChat`. Add a sticky "Open in Messages" button in the chat header that links to `/messages?request=:id` — `Messages.tsx` already selects by `selectedRequestId`, we'll read the query param on mount.
- `/messages` chat header gets an "Open request" link → `/sourcing-requests/:id`.
- Request rows in `/sourcing-requests` get a message icon (with unread badge from existing `get_unread_message_counts`) that deep-links straight to the chat view.

Agent dashboard (mirror):
- `/agent/requests/:id` chat panel gets "Open in Messages" → `/agent/messages?request=:id`.
- `/agent/messages` chat header gets "Open request" → `/agent/requests/:id`.
- `/agent/requests` table rows get the same message icon + unread badge.

All deep-links use existing routes; no router changes needed beyond reading a `?request=` query param in the two Messages pages.

---

## 5. Notifications

Reuse the existing notification rows:
- Customer notification on new quote already links to the request — update its `link` so it goes to `/sourcing-requests/:id#quote-<id>` and the card scrolls into view in the chat.
- Admin notification stays as-is.

---

## 6. Out of scope (not in this plan)

- Editing/withdrawing a quote after it's sent (keep current behavior — agent submits a new quote).
- Quote → Order/Invoice cross-links (you didn't pick those).
- Notification deep-linking polish beyond the one link tweak above.

---

## Technical notes (for the implementer)

- Migration: `ALTER TABLE messages ADD COLUMN message_type text NOT NULL DEFAULT 'text'`, `ADD COLUMN quote_id uuid REFERENCES quotes(id) ON DELETE SET NULL`, plus a partial index `(quote_id) WHERE quote_id IS NOT NULL`.
- Extend the `messages` select in `RequestChat` to also fetch the related quote when `quote_id IS NOT NULL` (single Supabase `select("*, quotes(*)")` join — quotes RLS already allows the request owner + agent/admin).
- New components: `QuoteComposerSheet.tsx`, `QuoteMessageCard.tsx`. Existing `AgentRequestDetail` keeps its standalone quote form (no regression); it can later call the same `QuoteComposerSheet` if you want one source of truth — flagged but not done in this pass.
- Realtime: extend the existing `chat-${requestId}` channel to also listen for `quotes` row updates filtered by `sourcing_request_id`.

---

## Acceptance checklist

- Agent can send a quote without leaving the chat.
- Customer sees the quote as a card inline with the conversation, can Accept/Reject, or click "View details".
- Status changes reflect live on both sides.
- From any request page or row, one click reaches its chat; from any chat, one click reaches the request — on customer and agent dashboards.