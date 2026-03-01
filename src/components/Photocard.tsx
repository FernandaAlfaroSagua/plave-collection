// src/components/Photocard.tsx
"use client";

import {Check, Pencil} from "lucide-react";

interface PhotocardProps {
  id: number;
  name: string;
  type: string;
  isCollected: boolean;
  members: string[];
  onClick: () => void;
  imageUrl?: string;
  era: string;
  isAdmin?: boolean;
  store?: string;
}

export const Photocard = ({
  name,
  type,
  isCollected,
  members,
  onClick,
  imageUrl,
  era,
  id,
  isAdmin = false,
  store = "",
}: PhotocardProps) => {
  const memberIcons: Record<string, string> = {
    Yejun: "🐬",
    Noah: "🦙",
    Bamby: "🦌",
    Eunho: "🐺",
    Hamin: "🐈‍⬛",
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que se marque como coleccionada al hacer clic en editar
    window.location.href = `/dashboard/upload/edit/${id}`; // Redirige a una página de edición
  };

  return (
    <div
      onClick={onClick}
      className={`relative group cursor-pointer transition-all duration-300 active:scale-95 ${
        isCollected ? "opacity-100" : "opacity-70 hover:opacity-90"
      }`}
    >
      {/* BOTÓN EDITAR (Solo para Admins) */}
      {isAdmin && (
        <button
          onClick={handleEdit}
          className="absolute top-2 right-2 z-30 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-slate-200 text-slate-600 hover:text-pink-500 hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
          title="Editar carta"
        >
          <Pencil className="w-4 h-4" />
        </button>
      )}
      <div
        className={`aspect-[2/3] rounded-2xl overflow-hidden border-4 transition-all duration-500 shadow-sm group-hover:shadow-xl ${
          isCollected
            ? "border-pink-300 ring-4 ring-pink-100/50"
            : "border-white bg-slate-200"
        }`}
      >
        <div className="w-full h-full bg-gradient-to-b from-slate-100 to-slate-300 flex items-center justify-center relative">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <span className="text-4xl opacity-20 group-hover:scale-110 transition-transform">
              ✨
            </span>
          )}

          {isCollected && (
            <div className="absolute inset-0 bg-pink-500/10 backdrop-blur-[1px] flex items-center justify-center">
              <div className="bg-white rounded-full p-2 shadow-lg scale-110 animate-in zoom-in duration-300">
                <Check className="w-6 h-6 text-pink-500 stroke-[3px]" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Badges de Miembros */}
      <div className="flex -space-x-2 absolute top-3 left-3">
        {members.map((m) => (
          <div
            key={m}
            title={m}
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center text-sm border border-slate-100 hover:z-10 transition-transform hover:-translate-y-1"
          >
            {memberIcons[m]}
          </div>
        ))}
      </div>

      <div className="mt-3 px-1">
        <div className="flex justify-between items-start gap-2 pt-1">
          {/* Lado izquierdo: Contenedor de etiquetas que se envuelven */}
          <div className="flex flex-wrap gap-1 flex-1">
            <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded uppercase tracking-tighter">
              {name}
            </span>
            <span className="text-[9px] font-bold text-slate-600 bg-green-100 px-1.5 py-0.5 rounded uppercase tracking-tighter">
              {type}
            </span>
            {store && (
              <span className="text-[9px] font-bold text-slate-600 bg-purple-100 px-1.5 py-0.5 rounded uppercase tracking-tighter">
                {store}
              </span>
            )}
          </div>

          {/* Lado derecho: Owned fijo */}
          {isCollected && (
            <span className="text-[10px] font-black text-pink-500 italic shrink-0 pt-0.5">
              OWNED
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
