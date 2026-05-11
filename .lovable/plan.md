## Remove "Top 10 Trending Products" from home page

Two small edits in `src/pages/Landing.tsx`:

1. Remove the lazy import on line 24:
   `const LandingTrending = lazy(() => import("@/components/landing/LandingTrending"));`
2. Remove the `<LandingTrending />` usage on line 565 (and its surrounding Suspense wrapper if it's dedicated to this component).

Leave `src/components/landing/LandingTrending.tsx` in place (unused) so it can be brought back easily if needed. If you'd prefer I delete the component file too, say so and I'll include that.

No other pages, routes, or backend logic are touched.