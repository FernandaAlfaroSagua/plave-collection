"use client";
import {useState} from "react";
import {usePathname} from "next/navigation";
import Link from "next/link";
import {logout} from "@/actions/auth";
import {Menu, X, LogOut, User, LayoutGrid} from "lucide-react";
import {motion, AnimatePresence} from "framer-motion";

export const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  if (pathname === "/login" || pathname === "/register") return null;

  const navLinks = [
    {name: "Checklist", href: "/dashboard", icon: LayoutGrid},
    {name: "Profile", href: "/profile", icon: User},
  ];

  // Variantes para el contenedor del menú
  const menuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  // Variantes para cada link individual
  const itemVariants = {
    closed: {opacity: 0, x: -10},
    open: {opacity: 1, x: 0},
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
        <Link
          href="/dashboard"
          className="text-xl font-black text-slate-800 italic tracking-tighter"
        >
          PLAVE<span className="text-pink-500">.</span>COLLECTION
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center font-bold text-slate-600 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`hover:text-pink-500 transition-colors py-1 ${
                pathname === link.href
                  ? "text-pink-500 border-b-2 border-pink-400"
                  : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
          <button
            onClick={() => logout()}
            className="bg-slate-900 text-white px-5 py-2 rounded-xl text-xs font-bold"
          >
            Logout
          </button>
        </div>

        {/* Hamburger Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2">
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu con AnimatePresence para detectar salida */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-slate-100 shadow-2xl overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <motion.div key={link.href} variants={itemVariants}>
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-4 p-4 rounded-2xl font-bold text-sm ${
                      pathname === link.href
                        ? "bg-pink-50 text-pink-500"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                variants={itemVariants}
                className="h-[1px] bg-slate-100 my-2"
              />

              <motion.div variants={itemVariants}>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  className="flex items-center gap-4 p-4 w-full rounded-2xl font-bold text-sm text-red-500 hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
