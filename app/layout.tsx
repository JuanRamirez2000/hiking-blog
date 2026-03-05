import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/ui/LogoutButton";
import Link from "next/link";
import "@/app/globals.css";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body className={`$bg-stone-950 text-stone-100 min-h-screen`}>
        <nav className="border-b border-stone-800 px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            ⛰ Trails
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/life-map"
              className="text-sm text-stone-400 hover:text-stone-100 transition-colors"
            >
              Life Map
            </Link>
            {user ? (
              <>
                <Link
                  href="/upload"
                  className="text-sm text-amber-400 hover:text-amber-300 transition-colors"
                >
                  + New Hike
                </Link>
                <LogoutButton />
              </>
            ) : (
              <Link
                href="/login"
                className="text-sm text-stone-400 hover:text-stone-100 transition-colors"
              >
                Sign in
              </Link>
            )}
          </div>
        </nav>
        <main className="max-w-4xl mx-auto px-6 py-10">{children}</main>
      </body>
    </html>
  );
}
