

## Diagnosis: Why Google Can't Fetch the Sitemap

### What I found

1. **The static `public/sitemap.xml` IS being served** at `https://equilinq.eu/sitemap.xml` with the correct XML content. No routing conflict -- Lovable hosting serves static files from `public/` before the SPA fallback kicks in, so `/sitemap.xml` is not being intercepted by React Router.

2. **No proxy/rewrite conflicts.** Protected routes like `/dashboard` are handled client-side by React Router (with `<Navigate to="/auth">` for unauthenticated users). There are no server-side rewrites blocking `/sitemap.xml`.

3. **The likely problem is the Content-Type header.** Lovable hosting may serve `.xml` files with `text/html` instead of `application/xml`. When I fetched the live URL, the response was parsed as HTML (the XML declaration was mangled into an HTML comment: `<!--?xml version="1.0"...-->`). Google requires a proper `application/xml` or `text/xml` Content-Type to parse sitemaps.

4. **The static sitemap is also incomplete.** It only has 20 hardcoded URLs. Your `dynamic-sitemap` edge function already exists and pulls published insight articles from the database, but `robots.txt` still points to the static file -- meaning Google never sees your article URLs.

### The Fix (two parts)

**Part 1: Point robots.txt to the dynamic-sitemap edge function**

The edge function already sets `Content-Type: application/xml` explicitly, which solves the header issue. Update `robots.txt`:

```
Sitemap: https://chmoabjmtbbqdrgigspm.supabase.co/functions/v1/dynamic-sitemap
```

Google supports cross-origin sitemap URLs declared in robots.txt, so this is valid.

**Part 2: Deploy and verify the dynamic-sitemap edge function**

- Deploy `dynamic-sitemap` (it may not be deployed yet since the logs showed no activity)
- Test it with a curl to confirm it returns valid XML with `Content-Type: application/xml`
- Verify it includes both static routes and dynamic insight article URLs

**Part 3: Keep the static file as a fallback**

Keep `public/sitemap.xml` in place (updated to match current routes) so direct visitors to `/sitemap.xml` still get something useful, but Google will use the edge function URL from `robots.txt`.

### Files changed

| File | Change |
|---|---|
| `public/robots.txt` | Update `Sitemap:` URL to point to the edge function |
| `supabase/functions/dynamic-sitemap/index.ts` | No changes needed (already correct) |
| Deploy | Deploy the `dynamic-sitemap` edge function |

### What this does NOT affect

- No changes to React routing, the SPA, or any protected routes
- No changes to the Vite build or SEO prerender plugin
- The `/about-us` redirect remains intact

