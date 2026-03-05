"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import sharp from "sharp";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function optimizeImage(file: File): Promise<Buffer> {
  const buffer = Buffer.from(await file.arrayBuffer());
  return sharp(buffer)
    .resize(1200, null, { withoutEnlargement: true }) // max 1200px wide, keep aspect ratio
    .webp({ quality: 80 })
    .toBuffer();
}

export async function uploadHike(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Parse form fields
  const title = formData.get("title") as string;
  const date = formData.get("date") as string;
  const location = formData.get("location") as string;
  const description = formData.get("description") as string;
  const distance_km = formData.get("distance_km")
    ? Number(formData.get("distance_km"))
    : null;
  const elevation_gain_m = formData.get("elevation_gain_m")
    ? Number(formData.get("elevation_gain_m"))
    : null;
  const duration_seconds = formData.get("duration_seconds")
    ? Number(formData.get("duration_seconds"))
    : null;
  const max_elevation_m = formData.get("max_elevation_m")
    ? Number(formData.get("max_elevation_m"))
    : null;
  const avg_heart_rate = formData.get("avg_heart_rate")
    ? Number(formData.get("avg_heart_rate"))
    : null;
  const max_heart_rate = formData.get("max_heart_rate")
    ? Number(formData.get("max_heart_rate"))
    : null;
  const slug = slugify(title);

  // Upload GPX file
  let gpx_path = null;
  const gpxFile = formData.get("gpx") as File;
  if (gpxFile && gpxFile.size > 0) {
    const { data, error } = await supabase.storage
      .from("hike-assets")
      .upload(`${user.id}/gpx/${slug}.gpx`, gpxFile, { upsert: true });
    if (error) throw error;
    gpx_path = data.path;
  }

  // Insert hike record
  const { data: hike, error: hikeError } = await supabase
    .from("hikes")
    .insert({
      user_id: user.id,
      slug,
      title,
      date,
      location,
      description,
      distance_km,
      elevation_gain_m,
      duration_seconds,
      max_elevation_m,
      avg_heart_rate,
      max_heart_rate,
      gpx_path,
      published: true,
    })
    .select()
    .single();

  if (hikeError) throw hikeError;

  // Upload and optimize photos
  const photos = formData.getAll("photos") as File[];
  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];
    if (photo.size === 0) continue;

    const storagePath = `${user.id}/photos/${slug}/${i}.webp`;
    const optimized = await optimizeImage(photo);

    const { error: photoUploadError } = await supabase.storage
      .from("hike-assets")
      .upload(storagePath, optimized, {
        upsert: true,
        contentType: "image/webp",
      });

    if (photoUploadError) throw photoUploadError;

    await supabase.from("hike_photos").insert({
      hike_id: hike.id,
      storage_path: storagePath,
      sort_order: i,
    });
  }

  redirect(`/hikes/${slug}`);
}
