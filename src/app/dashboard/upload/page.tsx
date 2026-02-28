import {uploadPhotocard} from "@/actions/auth";
import {GlassCard} from "@/components/GlassCard";
import Link from "next/link";
import {ChevronLeft} from "lucide-react";
import {FormUpload} from "@/components/FormUpload";

export default function UploadPage() {
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
            ADD NEW TREASURE
          </h1>
          <p className="text-slate-500 mb-8">
            Register a new photocard in the Asterum database.
          </p>

          <FormUpload
            imageUrl=""
            name=""
            era=""
            type=""
            releaseDate=""
            sortOrder={0}
            action={uploadPhotocard}
          />
        </GlassCard>
      </div>
    </div>
  );
}
