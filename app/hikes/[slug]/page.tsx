import { createClient } from "@/lib/supabase/server";
import { getHikeContent } from "@/lib/mdx";
import {
  formatDate,
  formatDistance,
  formatDuration,
  formatElevation,
} from "@/lib/utils";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function HikePage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch hike metadata from DB
  const { data: hike } = await supabase
    .from("hikes")
    .select("*, hike_photos(*)")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!hike) notFound();

  // Fetch MDX content from filesystem
  const mdx = getHikeContent(slug);
  if (!mdx) notFound();

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <div>
        <p className="text-stone-400 text-sm mb-2">
          {hike.location} · {formatDate(hike.date)}
        </p>
        <h1 className="text-4xl font-bold">{hike.title}</h1>
        {hike.description && (
          <p className="text-stone-300 mt-3 text-lg">{hike.description}</p>
        )}
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {hike.distance_km && (
          <StatCard label="Distance" value={formatDistance(hike.distance_km)} />
        )}
        {hike.elevation_gain_m && (
          <StatCard
            label="Elevation Gain"
            value={formatElevation(hike.elevation_gain_m)}
          />
        )}
        {hike.duration_seconds && (
          <StatCard
            label="Duration"
            value={formatDuration(hike.duration_seconds)}
          />
        )}
        {hike.max_elevation_m && (
          <StatCard
            label="Max Elevation"
            value={formatElevation(hike.max_elevation_m)}
          />
        )}
        {hike.avg_heart_rate && (
          <StatCard label="Avg HR" value={`${hike.avg_heart_rate} bpm`} />
        )}
        {hike.max_heart_rate && (
          <StatCard label="Max HR" value={`${hike.max_heart_rate} bpm`} />
        )}
      </div>

      {/* MDX Content */}
      <article className="prose prose-invert prose-stone max-w-none">
        <MDXRemote source={mdx.content} />
      </article>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-stone-900 border border-stone-800 rounded-lg p-4">
      <p className="text-stone-400 text-xs uppercase tracking-wide">{label}</p>
      <p className="text-white font-semibold text-lg mt-1">{value}</p>
    </div>
  );
}
