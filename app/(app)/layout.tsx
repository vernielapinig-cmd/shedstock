import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { Database } from '@/types/database'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .single();

  type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

  const fullName = 
    (profile as ProfileRow | null)?.full_name ??  "Household member";

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar fullName={fullName} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 pb-[100px] pt-4 md:px-8 md:pb-[100px] md:pt-7">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
