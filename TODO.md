# Hiking Blog — TODO

## Phase 1 Fixes (Before Phase 2)

### GPX Stats Extraction
- [ ] Create `lib/gpx.ts` to parse GPX files and extract stats
  - `distance_km` — sum of haversine distances between all trackpoints
  - `elevation_gain_m` — sum of all positive elevation deltas
  - `duration_seconds` — last trackpoint timestamp minus first
  - `max_elevation_m` — max `<ele>` value across all trackpoints
  - `avg_heart_rate` / `max_heart_rate` — parse Garmin `<gpxtpx:hr>` extensions if present
- [ ] Update `app/actions/upload-hike.ts` to call `parseGPX()` instead of reading stats from form
- [ ] Remove stats section from upload form — only title, date, location, description, and files needed

### UI Overhaul
- [ ] Restructure `/components` directory:
  ```
  components/
  ├── ui/         # pure primitives — Button, Card, Input, Badge, StatCard
  ├── hike/       # domain components — HikeCard, HikeStats, PhotoGallery, BreadcrumbPin
  ├── map/        # Mapbox components — TrailMap, ViewshedLayer, LifeMap
  └── layout/     # Nav, PageHeader
  ```
- [ ] Move `StatCard` out of `app/hikes/[slug]/page.tsx` into `components/ui/StatCard.tsx`
- [ ] Move hike card on home page into `components/hike/HikeCard.tsx`
- [ ] Move `LogoutButton` into `components/layout/Nav.tsx`

### Design System
- [ ] Set up CSS variable token system in `globals.css` using Tailwind v4 `@theme`:
  ```css
  @theme {
    --color-bg: #0c0a09;
    --color-surface: #1c1917;
    --color-border: #292524;
    --color-accent: #f59e0b;
  }
  ```
- [ ] Create `components/ui/tokens.ts` exporting the same values as JS constants for use in Mapbox styles and canvas elements

### Upload Form Improvements
- [ ] Add `useActionState` for inline error handling on the upload form (no full page reload on error)
- [ ] Add loading state + spinner on submit button to prevent double submissions
- [ ] Make MDX optional on the hike detail page — render stats + placeholder if no MDX file found instead of returning 404

### Auth / Routing
- [ ] Add `middleware.ts` at project root to protect `/upload` and any future admin routes before they render

---

## Phase 2 — 3D Map + GPX
- [ ] Set up Mapbox GL JS with 3D terrain
- [ ] Render GPX trail line on the map
- [ ] Add breadcrumb markers that link to MDX section anchors
- [ ] Drape breadcrumb layer over terrain using `fill-elevation-reference: 'sea'`

---

## Phase 3 — Viewshed / Fog of War
- [ ] Python pipeline: GPX → sample points → download USGS DEM tiles → reproject to UTM → raycast viewshed → vectorize to GeoJSON
- [ ] Store viewshed GeoJSON and raw raster in Supabase Storage
- [ ] Serve viewshed as a draping polygon layer on the Mapbox map

---

## Phase 4 — Life Map (Cumulative Viewshed)
- [ ] Define master raster grid for hiking region at fixed resolution (30m)
- [ ] On each hike upload, reproject and merge viewshed into cumulative GeoTIFF
- [ ] Re-vectorize cumulative raster to GeoJSON after each merge
- [ ] Build `/life-map` page rendering the cumulative viewshed on a full-screen Mapbox map

---

## Phase 5 — Multi-User
- [ ] Add env flag to enable/disable public registration
- [ ] Build registration page
- [ ] Build user profile page
- [ ] Consider replacing MDX files with database-stored content + custom rich text editor
  - MDX stored as text column in `hikes` table
  - Custom editor with live MDX preview panel
- [ ] Scope all queries and storage paths by `user_id` (already done at schema level)