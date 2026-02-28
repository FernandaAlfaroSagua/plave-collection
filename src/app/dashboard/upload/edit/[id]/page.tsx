// src/app/dashboard/edit/[id]/page.tsx
import {editPhotocard, getPhotocardDetails} from "@/actions/auth";
import {GlassCard} from "@/components/GlassCard";
import Link from "next/link";
import {ChevronLeft} from "lucide-react";
import {FormUpload} from "@/components/FormUpload";
import {notFound} from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}

export default async function EditPage({params}: Props) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);
  const detail = await getPhotocardDetails(id);

  console.log("detail", detail);

  if (!detail) {
    notFound();
  }

  const updateActionWithId = editPhotocard.bind(null, id);

  return (
    <div className="min-h-screen p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-slate-500 hover:text-pink-500 transition-colors mb-6 font-bold text-sm"
        >
          <ChevronLeft className="w-4 h-4" /> BACK TO DASHBOARD
        </Link>

        <GlassCard className="p-8 border-2 border-white">
          <h1 className="text-3xl font-black text-slate-800 mb-2">
            EDIT TREASURE
          </h1>
          <p className="text-slate-500 mb-8">
            Update the details of an existing photocard in the Asterum database.
          </p>

          <FormUpload
            imageUrl={detail.image_url}
            name={detail.name}
            era={detail.era}
            type={detail.type}
            releaseDate={detail.release_date}
            sortOrder={detail.sort_order}
            selectedMembers={detail.members}
            action={updateActionWithId}
            store={detail.store}
          />
        </GlassCard>
      </div>
    </div>
  );
}
