

# Plan: Remove Em-Dashes + Set Up noreply Email

## 1. Remove All Em-Dashes (—) from UI Text

Replace every `—` (em-dash) with an appropriate alternative across 13 files. Two categories:

**User-visible text** — replace with regular dash (-), colon (:), or rephrase:
- `CustomerDashboard.tsx` — "tell us what you need and we'll find..." (remove dash, rephrase)
- `NewRequest.tsx` — subtitles like "the more detail, the better" and "perfect for testing" (use colon or comma)
- `FileUpload.tsx` — "max 10MB each" (use comma)
- `Messages.tsx` — "No messages yet" (use period or ellipsis)
- `Orders.tsx`, `Products.tsx`, `AdminQuotes.tsx`, `AdminRequests.tsx`, `AgentRequests.tsx`, `AgentRequestDetail.tsx` — fallback `"—"` for empty values → replace with `"-"`

**Code comments** — replace `—` with `–` or `-` in:
- `CustomerDashboard.tsx`, `AdminDashboard.tsx`, `AgentRequestDetail.tsx`

**Files to edit:** ~13 files, all in `src/pages/` and `src/components/`

## 2. Set Up noreply@equilinq.eu Email

Email domain setup requires workspace admin or owner permissions. I'll guide you through opening the email setup dialog so you can configure `equilinq.eu` as your sender domain with `noreply@equilinq.eu` as the sender address. This involves adding DNS records to your domain.

After the domain is configured, I can scaffold branded auth email templates that match Equilinq's design.

