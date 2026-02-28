import {createClient} from "@/lib/supabase/server";
import DashboardContent from "@/components/DashboardContent";
import {SupabaseCardResponse} from "@/types/photocard.type";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: {user},
  } = await supabase.auth.getUser();

  const {data: cards} = (await supabase.from("photocards").select(`
    id, name, type, image_url, era,
    release_date, sort_order, store,
    photocard_members(member_name),
    user_collection(user_id)
  `)) as {data: SupabaseCardResponse[] | null};
  const formattedCards =
    cards?.map((card) => ({
      id: card.id,
      name: card.name,
      type: card.type,
      era: card.era,
      image_url: card.image_url,
      members: card.photocard_members.map((m) => m.member_name),
      isCollected: card.user_collection.some((uc) => uc.user_id === user?.id),
      sort_order: card.sort_order,
      release_date: card.release_date,
      store: card.store ?? "",
    })) || [];

  const {data: profile} = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user?.id)
    .single();

  const isAdmin = profile?.is_admin || false;

  return <DashboardContent initialCards={formattedCards} isAdmin={isAdmin} />;
}
