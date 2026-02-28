"use client";
import {usePathname} from "next/navigation";
import Link from "next/link";
import {logout} from "@/actions/auth";

export const Navbar = () => {
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <nav className="sticky top-0 z-50 w-full p-4 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo / Título */}
        <Link
          href="/dashboard"
          className="text-xl font-black text-slate-800 tracking-tighter"
        >
          PLAVE<span className="text-pink-500">.</span>COLLECTION
        </Link>

        {/* Links de Navegación */}
        <div className="flex gap-6 items-center font-bold text-slate-600 text-sm">
          <Link
            href="/dashboard"
            className={
              `hover:text-slate-900 transition-colors ` +
              (pathname === "/dashboard"
                ? "text-pink-500 border-b-2 border-pink-400 pb-0.5"
                : "")
            }
          >
            Checklist
          </Link>
          <Link
            href="/profile"
            className={
              `hover:text-slate-900 transition-colors ` +
              (pathname === "/profile"
                ? "text-pink-500 border-b-2 border-pink-400 pb-0.5"
                : "")
            }
          >
            Profile
          </Link>
          <Link
            href="/login"
            className="bg-slate-800 text-white px-4 py-2 rounded-xl text-xs hover:bg-slate-700 transition-all active:scale-95"
            onClick={logout}
          >
            Logout
          </Link>
        </div>
      </div>
    </nav>
  );
};
