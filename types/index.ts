import type { Database } from "./database";

export type Hike = Database["public"]["Tables"]["hikes"]["Row"];
export type HikePhoto = Database["public"]["Tables"]["hike_photos"]["Row"];
export type Breadcrumb = Database["public"]["Tables"]["breadcrumbs"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type CumulativeViewshed =
  Database["public"]["Tables"]["cumulative_viewshed"]["Row"];

// Useful composite types
export type HikeWithPhotos = Hike & {
  hike_photos: HikePhoto[];
};

export type HikeInsert = Database["public"]["Tables"]["hikes"]["Insert"];
export type HikeUpdate = Database["public"]["Tables"]["hikes"]["Update"];
