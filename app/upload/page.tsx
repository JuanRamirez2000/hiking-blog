import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { uploadHike } from "@/app/actions/upload-hike";

export default async function UploadPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">New Hike</h1>
      <p className="text-stone-400 mb-8">Document your trail</p>

      <form action={uploadHike} className="flex flex-col gap-6">
        {/* Core info */}
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-stone-300">Details</h2>

          <Field label="Title" name="title" type="text" required />
          <Field label="Date" name="date" type="date" required />
          <Field label="Location" name="location" type="text" />

          <div className="flex flex-col gap-1">
            <label className="text-sm text-stone-400">Description</label>
            <textarea
              name="description"
              rows={3}
              className="bg-stone-900 border border-stone-700 rounded-lg px-4 py-2 text-stone-100 focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>
        </section>

        {/* Stats */}
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-stone-300">Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Distance (km)"
              name="distance_km"
              type="number"
              step="0.01"
            />
            <Field
              label="Elevation Gain (m)"
              name="elevation_gain_m"
              type="number"
            />
            <Field
              label="Duration (seconds)"
              name="duration_seconds"
              type="number"
            />
            <Field
              label="Max Elevation (m)"
              name="max_elevation_m"
              type="number"
            />
            <Field label="Avg Heart Rate" name="avg_heart_rate" type="number" />
            <Field label="Max Heart Rate" name="max_heart_rate" type="number" />
          </div>
        </section>

        {/* Files */}
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-stone-300">Files</h2>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-stone-400">GPX File</label>
            <input
              name="gpx"
              type="file"
              accept=".gpx"
              className="text-stone-300 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-stone-800 file:text-stone-300 hover:file:bg-stone-700"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-stone-400">Photos</label>
            <input
              name="photos"
              type="file"
              accept="image/*"
              multiple
              className="text-stone-300 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-stone-800 file:text-stone-300 hover:file:bg-stone-700"
            />
          </div>
        </section>

        <button
          type="submit"
          className="bg-amber-400 text-stone-900 font-semibold py-3 rounded-lg hover:bg-amber-300 transition-colors"
        >
          Upload Hike
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type,
  required,
  step,
}: {
  label: string;
  name: string;
  type: string;
  required?: boolean;
  step?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-stone-400">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        step={step}
        className="bg-stone-900 border border-stone-700 rounded-lg px-4 py-2 text-stone-100 focus:outline-none focus:border-amber-400"
      />
    </div>
  );
}
