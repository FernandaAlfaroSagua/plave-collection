import {createClient} from "@/lib/supabase/server";
import {GlassCard} from "@/components/GlassCard";
import {redirect} from "next/navigation";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const {data: profile, error} = await supabase
    .from("profiles")
    .select("username, bias, avatar_url")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    return <div>Error al cargar el perfil.</div>;
  }

  const {data: allPhotocards, error: photoError} = await supabase
    .from("photocards")
    .select("*");

  const {data: photocardMembers} = await supabase
    .from("photocard_members")
    .select("*");

  console.log("photocards", allPhotocards, photoError);

  const {data: userCollection} = await supabase
    .from("user_collection")
    .select("photocard_id")
    .eq("user_id", user.id)
    .eq("is_wishlist", false);

  const members = ["Yejun", "Noah", "Bamby", "Eunho", "Hamin"];
  const memberTotals: Record<string, {total: number; collected: number}> = {};
  for (const m of members) {
    memberTotals[m] = {total: 0, collected: 0};
  }

  const photocardIdToMembers = new Map<number, string[]>();
  if (photocardMembers) {
    for (const pm of photocardMembers) {
      if (!photocardIdToMembers.has(pm.photocard_id)) {
        photocardIdToMembers.set(pm.photocard_id, []);
      }
      photocardIdToMembers.get(pm.photocard_id)?.push(pm.member_name);
    }
  }

  if (allPhotocards) {
    for (const card of allPhotocards) {
      const cardMembers = photocardIdToMembers.get(card.id) || [];
      for (const m of cardMembers) {
        if (memberTotals[m]) {
          memberTotals[m].total++;
        }
      }
    }
  }
  if (userCollection && allPhotocards) {
    const collectedIds = new Set(userCollection.map((c) => c.photocard_id));
    for (const card of allPhotocards) {
      if (!collectedIds.has(card.id)) continue;
      const cardMembers = photocardIdToMembers.get(card.id) || [];
      for (const m of cardMembers) {
        if (memberTotals[m]) {
          memberTotals[m].collected++;
        }
      }
    }
  }

  const totalCollected = userCollection
    ? new Set(userCollection.map((c) => c.photocard_id)).size
    : 0;

  const totalInApp = allPhotocards ? allPhotocards.length : 0;
  const percentage = totalInApp
    ? Math.round((totalCollected / totalInApp) * 100)
    : 0;

  const memberPercentages: Record<string, number> = {};
  for (const m of members) {
    memberPercentages[m] =
      memberTotals[m].total > 0
        ? Math.round((memberTotals[m].collected / memberTotals[m].total) * 100)
        : 0;
  }

  const memberData: Record<string, {icon: string; color: string}> = {
    Yejun: {
      icon: "🐬",
      color: "from-blue-100 to-blue-200 border-blue-300",
    },
    Noah: {
      icon: "🦙",
      color: "from-purple-100 to-purple-200 border-purple-300",
    },
    Bamby: {
      icon: "🦌",
      color: "from-pink-100 to-pink-200 border-pink-300",
    },
    Eunho: {
      icon: "🐺",
      color: "from-slate-300 to-slate-400 border-slate-500",
    },
    Hamin: {
      icon: "🐈‍⬛",
      color: "from-emerald-100 to-emerald-200 border-emerald-300",
    },
  };

  const selectedColor =
    memberData[profile.bias]?.color || "from-slate-100 to-slate-200";

  // Buscar una photocard coleccionada del bias
  let biasPhotoUrl: string | null = null;
  if (userCollection && allPhotocards && photocardMembers) {
    // 1. IDs de photocards coleccionadas
    const collectedIds = new Set(userCollection.map((c) => c.photocard_id));
    // 2. IDs de photocards del bias
    const biasPhotocardIds = photocardMembers
      .filter((pm) => pm.member_name === profile.bias)
      .map((pm) => pm.photocard_id);
    // 3. Filtrar las que están coleccionadas
    const collectedBiasPhotocards = allPhotocards.filter(
      (card) =>
        collectedIds.has(card.id) &&
        biasPhotocardIds.includes(card.id) &&
        card.image_url,
    );
    if (collectedBiasPhotocards.length > 0) {
      // Elegir una al azar
      const randomIdx = Math.floor(
        Math.random() * collectedBiasPhotocards.length,
      );
      biasPhotoUrl = collectedBiasPhotocards[randomIdx].image_url;
    }
  }
  return (
    <div className="flex items-center justify-center p-6">
      <GlassCard
        className={`p-8 w-full max-w-4xl border-2 bg-gradient-to-br ${selectedColor}`}
      >
        <div className="flex flex-col items-center">
          {/* Avatar circular o foto del bias */}
          {biasPhotoUrl ? (
            <img
              src={biasPhotoUrl}
              alt={profile.bias + " photocard"}
              className="w-24 h-24 object-cover rounded-full border-4 border-white mb-4 shadow-md bg-white/50"
              style={{aspectRatio: "2/3"}}
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-white/50 border-4 border-white mb-4 flex items-center justify-center text-3xl shadow-sm">
              {profile.username?.charAt(0).toUpperCase()}
            </div>
          )}

          <h1 className="text-2xl font-black text-slate-800">
            @{profile.username}
          </h1>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Your PLAVE Bias
            </span>
            <div className="mt-1 px-4 py-1 rounded-full bg-white/60 text-slate-700 font-bold shadow-sm flex items-center gap-2">
              <span>{memberData[profile.bias]?.icon}</span>
              <span>{profile.bias}</span>
            </div>
          </div>

          <div className="mt-8 w-full border-t border-white/40 pt-6">
            <p className="text-xs text-center text-slate-500 italic">
              &quot;Connected to Asterum from your PLLI profile&quot;
            </p>
          </div>
        </div>

        <div className="mt-8 w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Columna izquierda: global */}
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase mb-2 text-center min-h-[1em]">
              &nbsp;
            </p>
            <div className="grid grid-cols-2 gap-4 w-full">
              {/* Tarjeta de Cantidad */}
              <div className="bg-white/40 p-4 rounded-2xl text-center border border-white/20">
                <p className="text-[10px] font-bold text-slate-500 uppercase">
                  Collected
                </p>
                <p className="text-2xl font-black text-slate-800">
                  {totalCollected || 0} / {totalInApp}
                </p>
              </div>

              {/* Tarjeta de Progreso */}
              <div className="bg-white/40 p-4 rounded-2xl text-center border border-white/20">
                <p className="text-[10px] font-bold text-slate-500 uppercase">
                  Total Progress
                </p>
                <p className="text-2xl font-black text-slate-800">
                  {percentage}%
                </p>
              </div>
            </div>
            {/* Barra de progreso visual */}
            <div className="w-full bg-white/30 h-2 rounded-full mt-4 overflow-hidden">
              <div
                className="bg-pink-400 h-full transition-all duration-1000"
                style={{width: `${percentage}%`}}
              />
            </div>
          </div>
          {/* Columna derecha: miembros */}
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase mb-2 text-center">
              Progress by Member
            </p>
            <div className="grid grid-cols-3 gap-2">
              {members.map((m) => (
                <div
                  key={m}
                  className={`flex flex-col items-center p-2 rounded-xl border-2 transition-all
                    ${
                      profile.bias === m
                        ? "border-pink-400 bg-pink-50 scale-105 shadow-lg"
                        : "border-white/30 bg-white/30"
                    }
                  `}
                >
                  <span className="text-xl mb-1">{memberData[m].icon}</span>
                  <span className="text-xs font-bold text-slate-700">{m}</span>
                  <span
                    className={`text-lg font-black ${profile.bias === m ? "text-pink-500" : "text-slate-700"}`}
                  >
                    {memberPercentages[m]}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
