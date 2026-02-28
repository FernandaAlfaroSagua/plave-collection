import {FormLogin} from "../../components/FormLogin";
import {GlassCard} from "../../components/GlassCard";
import {ToastListener} from "@/components/ToastListener";
import {Suspense} from "react";

export default function LoginPage() {
  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4">
      <Suspense fallback={null}>
        <ToastListener />
      </Suspense>
      <GlassCard className="p-10 w-full max-w-md text-center">
        <h1 className="text-3xl font-black text-slate-800 mb-2">
          ASTERUM ACCESS
        </h1>
        <p className="text-slate-600 mb-8 text-sm">Sync your PLLI collection</p>

        <FormLogin />
      </GlassCard>
    </div>
  );
}
