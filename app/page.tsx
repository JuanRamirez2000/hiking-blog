import { createClient } from "@/lib/supabase/server";
import {
  formatDate,
  formatDistance,
  formatDuration,
  formatElevation,
} from "@/lib/utils";
import type { Hike } from "@/types";
import Link from "next/link";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: hikes } = await supabase
    .from("hikes")
    .select("*")
    .eq("published", true)
    .order("date", { ascending: false });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Trail Journal</h1>
      <p className="text-stone-400 mb-10">
        A record of every hike, every view.
      </p>

      {!hikes?.length && (
        <p className="text-stone-500">No hikes yet. Get outside!</p>
      )}

      <div className="flex flex-col gap-6">
        {hikes?.map((hike: Hike) => (
          <Link
            key={hike.id}
            href={`/hikes/${hike.slug}`}
            className="group border border-stone-800 rounded-xl p-6 hover:border-stone-600 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold group-hover:text-amber-400 transition-colors">
                  {hike.title}
                </h2>
                <p className="text-stone-400 text-sm mt-1">
                  {hike.location} · {formatDate(hike.date)}
                </p>
                {hike.description && (
                  <p className="text-stone-300 text-sm mt-3 line-clamp-2">
                    {hike.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-6 mt-4 text-sm text-stone-400">
              {hike.distance_km && (
                <span>📍 {formatDistance(hike.distance_km)}</span>
              )}
              {hike.elevation_gain_m && (
                <span>⬆ {formatElevation(hike.elevation_gain_m)}</span>
              )}
              {hike.duration_seconds && (
                <span>⏱ {formatDuration(hike.duration_seconds)}</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
