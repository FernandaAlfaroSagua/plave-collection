"use server";

import {createClient} from "@/lib/supabase/server";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";

interface PhotocardMember {
  member_name: string;
}

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const {error} = await supabase.auth.signInWithPassword(data);

  if (error) {
    if (error.message.includes("Email not confirmed")) {
      return redirect("/login?message=unconfirmed");
    }
    return redirect("/login?message=invalid-credentials");
  }

  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  redirect("/login");
}
export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const username = formData.get("username") as string;
  const bias = formData.get("bias") as string; // <--- Nuevo campo

  const {error} = await supabase.auth.signUp({
    email,
    password,
    options: {data: {bias, username}},
  });

  if (error) return redirect("/register?message=error");

  return redirect("/login?message=check-email");
}

export async function toggleCollection(photocardId: number) {
  const supabase = await createClient();
  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) return;

  const {data: existing} = await supabase
    .from("user_collection")
    .select()
    .eq("user_id", user.id)
    .eq("photocard_id", photocardId)
    .single();

  if (existing) {
    await supabase.from("user_collection").delete().eq("id", existing.id);
  } else {
    await supabase.from("user_collection").insert({
      user_id: user.id,
      photocard_id: photocardId,
      is_wishlist: false,
    });
  }
}

export async function uploadPhotocard(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const selectedMembers = formData.getAll("members") as string[];
  const era = formData.get("era") as string; // Capturar
  let releaseDate = formData.get("release_date") as string;
  if (releaseDate?.length === 7) {
    releaseDate = `${releaseDate}-01`;
  }
  const store = formData.get("store") as string;
  const sortOrder = Number.parseInt(formData.get("sort_order") as string) || 0;

  const {data: card, error: cardError} = await supabase
    .from("photocards")
    .insert([
      {
        name,
        type,
        image_url: imageUrl,
        era,
        release_date: releaseDate,
        sort_order: sortOrder,
        store,
      },
    ])
    .select("id") // Le pedimos que nos devuelva el ID que acaba de generar
    .single();

  if (cardError) {
    console.error("Error en photocards:", cardError.message);
    throw new Error(cardError.message);
  }

  // --- PARTE 2: INSERTAR LOS MIEMBROS ---
  // Ahora usamos el 'card.id' que obtuvimos arriba
  if (selectedMembers.length > 0) {
    const memberInserts = selectedMembers.map((member) => ({
      photocard_id: card.id,
      member_name: member,
    }));

    const {error: memberError} = await supabase
      .from("photocard_members")
      .insert(memberInserts);

    if (memberError) {
      console.error("Error en miembros:", memberError.message);
      throw new Error(memberError.message);
    }
  }

  // Refrescamos los datos y volvemos al dashboard
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function getPhotocardDetails(id: number) {
  const supabase = await createClient();

  console.log("id", id);

  // 1. Validamos que el ID sea un número válido
  if (!id || Number.isNaN(id)) {
    console.error("ID no válido recibido en getPhotocardDetails:", id);
    return null;
  }

  // 2. Consulta simplificada en una sola línea para evitar errores de sintaxis
  const {data: card, error} = await supabase
    .from("photocards")
    .select(
      "id, name, type, image_url, era, release_date, sort_order, photocard_members(member_name), store",
    )
    .eq("id", id)
    .single();

  if (error || !card) {
    console.error("Error de Supabase:", error?.message);
    return null;
  }

  // 3. Retornamos los datos formateados
  return {
    ...card,
    // Verificamos que photocard_members sea un array antes de mapear
    members: Array.isArray(card.photocard_members)
      ? card.photocard_members.map((m: PhotocardMember) => m.member_name)
      : [],
  };
}

export async function editPhotocard(cardId: number, formData: FormData) {
  const supabase = await createClient();

  // 1. Recolección de datos básicos
  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const era = formData.get("era") as string;
  const store = formData.get("store") as string;
  const sortOrder = Number.parseInt(formData.get("sort_order") as string) || 0;

  // Captura de fecha y parche para PostgreSQL
  let releaseDate = formData.get("release_date") as string;
  if (releaseDate?.length === 7) {
    releaseDate = `${releaseDate}-01`;
  }

  // 2. Limpieza de miembros: Set elimina duplicados visuales del formulario
  const rawMembers = formData.getAll("members") as string[];
  const uniqueMembers = [...new Set(rawMembers.map((m) => String(m).trim()))];

  // 3. ACTUALIZACIÓN DE LA TABLA PRINCIPAL
  const {error: updateError} = await supabase
    .from("photocards")
    .update({
      name,
      type,
      image_url: imageUrl,
      era,
      release_date: releaseDate,
      sort_order: sortOrder,
      store,
    })
    .eq("id", cardId);

  if (updateError)
    throw new Error(`Error en photocards: ${updateError.message}`);

  // 4. MANEJO DE MIEMBROS (LA PARTE CRÍTICA)
  // Borramos TODOS los miembros actuales. Usamos await para asegurar que termine.
  const {error: deleteError} = await supabase
    .from("photocard_members")
    .delete()
    .eq("photocard_id", cardId);

  if (deleteError)
    throw new Error("No se pudieron limpiar los miembros antiguos");

  // 5. INSERCIÓN LIMPIA
  if (uniqueMembers.length > 0) {
    const memberInserts = uniqueMembers.map((member) => ({
      photocard_id: cardId,
      member_name: member,
    }));

    // Usamos UPSERT en lugar de INSERT.
    // Aunque acabamos de borrar, el upsert es más tolerante a errores de red o re-intentos.
    const {error: memberError} = await supabase
      .from("photocard_members")
      .upsert(memberInserts, {
        onConflict: "photocard_id,member_name",
      });

    console.log("mem", memberError);

    if (memberError) {
      console.error("Error persistente en miembros:", memberError.message);
      throw new Error("Error al guardar los miembros");
    }
  }

  // 6. Finalización
  revalidatePath("/dashboard");
  redirect("/dashboard");
}
