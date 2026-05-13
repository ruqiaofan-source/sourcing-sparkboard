## Add "Beta" badge to dashboard

Add a small "Beta" badge to the dashboard sidebar next to the Equilinq logo so users know the platform is in beta access.

### Change
- Update `src/components/AppSidebar.tsx`: add a "Beta" pill/badge below or beside the logo image in the sidebar header area.
- Style: subtle, using semantic tokens — e.g. a small rounded badge with `bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold uppercase`.
- Should be visible in both expanded and collapsed sidebar states.