"use client";

import {useMemo, useState, useEffect} from "react";
import {
  Search,
  Download,
  Plus,
  FilterX,
  ChevronUp,
  Map as MapIcon,
} from "lucide-react";
import {motion, AnimatePresence} from "framer-motion";
import {Photocard} from "./Photocard";
import {toggleCollection} from "@/actions/auth";
import {Card} from "@/types/photocard.type";
import Link from "next/link";
import {generateCollectionPDF} from "@/lib/exportPdf";
import Select from "react-select";

interface Props {
  readonly initialCards: Card[];
  readonly isAdmin: boolean;
}

export default function DashboardContent({initialCards, isAdmin}: Props) {
  // --- ESTADOS ---
  const [filter, setFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [eraFilter, setEraFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [loadingPDF, setLoadingPDF] = useState(false);

  // Estados para Navegación
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showJumpMenu, setShowJumpMenu] = useState(false);

  const members = ["All", "Yejun", "Noah", "Bamby", "Eunho", "Hamin"];

  // --- EFECTOS ---
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- LÓGICA DE FILTRADO Y ORDENAMIENTO ---
  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      const matchesMember = filter === "All" || card.members.includes(filter);
      const matchesEra = eraFilter === "All" || card.era === eraFilter;
      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Owned" ? card.isCollected : !card.isCollected);

      const searchLower = searchQuery.toLowerCase();
      return (
        matchesMember &&
        matchesEra &&
        matchesStatus &&
        (card.name.toLowerCase().includes(searchLower) ||
          card.type.toLowerCase().includes(searchLower) ||
          card.era.toLowerCase().includes(searchLower))
      );
    });
  }, [cards, filter, eraFilter, statusFilter, searchQuery]);

  const sortedEras = useMemo(() => {
    const eraMap = new Map<string, number>();
    for (const card of cards) {
      const time = Date.parse(card.release_date);
      const currentMax = eraMap.get(card.era);
      if (currentMax === undefined || time > currentMax) {
        eraMap.set(card.era, time);
      }
    }
    return Array.from(eraMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([era]) => era);
  }, [cards]);

  // --- ACCIONES ---
  const handleToggle = async (cardId: number) => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === cardId ? {...c, isCollected: !c.isCollected} : c,
      ),
    );
    await toggleCollection(cardId);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
      setShowJumpMenu(false);
    }
  };

  const resetFilters = () => {
    setFilter("All");
    setStatusFilter("All");
    setEraFilter("All");
    setSearchQuery("");
  };

  const hasFilters =
    filter !== "All" ||
    statusFilter !== "All" ||
    eraFilter !== "All" ||
    searchQuery !== "";

  const eraOptions = sortedEras.map((era) => ({value: era, label: era}));
  eraOptions.unshift({value: "All", label: "All Eras"});

  return (
    <div className="p-6 max-w-7xl mx-auto relative">
      {/* HEADER */}
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tighter italic">
            PLAVE
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Asterum Collection Manager
          </p>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex gap-2">
            <button
              onClick={async () => {
                setLoadingPDF(true);
                await generateCollectionPDF(
                  cards.filter((c) => c.isCollected),
                  "Mi Colección",
                  "mi-coleccion",
                );
                setLoadingPDF(false);
              }}
              disabled={loadingPDF}
              className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2 text-xs font-bold shadow-sm disabled:opacity-50"
            >
              <Download
                className={`w-4 h-4 ${loadingPDF ? "animate-bounce" : "text-pink-500"}`}
              />{" "}
              OWNED
            </button>
            <button
              onClick={async () => {
                setLoadingPDF(true);
                await generateCollectionPDF(
                  cards.filter((c) => !c.isCollected),
                  "Wishlist",
                  "mi-wishlist",
                );
                setLoadingPDF(false);
              }}
              disabled={loadingPDF}
              className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2 text-xs font-bold shadow-sm disabled:opacity-50"
            >
              <Download
                className={`w-4 h-4 ${loadingPDF ? "animate-bounce" : "text-slate-400"}`}
              />{" "}
              WISHLIST
            </button>
          </div>

          {isAdmin && (
            <Link
              href="/dashboard/upload"
              className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-slate-200"
            >
              <Plus className="w-4 h-4" /> Add Card
            </Link>
          )}

          <div className="relative w-full md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-pink-300 text-sm"
            />
          </div>
        </div>
      </header>

      {/* FILTROS */}
      <div className="flex flex-col gap-6 mb-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar flex-1">
            {members.map((m) => (
              <button
                key={m}
                onClick={() => setFilter(m)}
                className={`px-5 py-2 rounded-full font-bold text-xs border transition-all whitespace-nowrap ${
                  filter === m
                    ? "bg-slate-800 text-white shadow-lg"
                    : "bg-white text-slate-500 border-slate-200 hover:border-pink-200"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-600 outline-none"
            >
              <option value="All">All Status</option>
              <option value="Owned">Collected ✅</option>
              <option value="Wishlist">Missing 💎</option>
            </select>

            <div className="w-full md:w-60">
              {" "}
              {/* Contenedor para controlar el ancho */}
              <Select
                instanceId="era-select"
                options={eraOptions}
                defaultValue={eraOptions[0]}
                onChange={(option) => setEraFilter(option?.value || "All")}
                placeholder="Select Era..."
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: "0.75rem",
                    padding: "2px",
                    border: "1px solid #e2e8f0",
                    fontSize: "0.75rem",
                    fontWeight: "700",
                    boxShadow: "none",
                    "&:hover": {border: "1px solid #f9a8d4"},
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected
                      ? "#f472b6"
                      : state.isFocused
                        ? "#fdf2f8"
                        : "white",
                    color: state.isSelected ? "white" : "#475569",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                  }),
                }}
              />
            </div>

            {hasFilters && (
              <button
                onClick={resetFilters}
                className="p-2 bg-pink-50 text-pink-500 rounded-xl hover:bg-pink-100 transition-colors"
              >
                <FilterX className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
          {filteredCards.length}{" "}
          {filteredCards.length === 1 ? "treasure" : "treasures"} found
        </p>
      </div>

      {/* SECCIONES POR ERA */}
      <div className="space-y-16 min-h-[60vh]">
        {sortedEras
          .filter((era) => filteredCards.some((c) => c.era === era))
          .map((era) => {
            const cardsInEra = filteredCards
              .filter((c) => c.era === era)
              .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

            return (
              <section key={era} id={era.replace(/\s+/g, "-")}>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest">
                    {era}
                  </h2>
                  <div className="h-[2px] flex-1 bg-slate-100"></div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {cardsInEra.map((card) => (
                    <Photocard
                      key={card.id}
                      {...card}
                      imageUrl={card.image_url}
                      onClick={() => handleToggle(card.id)}
                      isAdmin={isAdmin}
                    />
                  ))}
                </div>
              </section>
            );
          })}

        {filteredCards.length === 0 && (
          <div className="text-center py-32 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold italic">
              No treasures found in this sector of Asterum 🌌
            </p>
          </div>
        )}
      </div>

      {/* CONTROLES FLOTANTES */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
        <AnimatePresence>
          {showJumpMenu && (
            <motion.div
              initial={{opacity: 0, scale: 0.9, y: 10}}
              animate={{opacity: 1, scale: 1, y: 0}}
              exit={{opacity: 0, scale: 0.9, y: 10}}
              className="absolute bottom-16 right-0 bg-white p-4 rounded-2xl shadow-2xl border border-slate-100 w-64 max-h-[50vh] overflow-y-auto no-scrollbar"
            >
              <p className="text-[10px] font-black text-slate-400 uppercase mb-3 px-2">
                Jump to:
              </p>
              <div className="flex flex-col gap-1">
                {sortedEras
                  .filter((era) => filteredCards.some((c) => c.era === era))
                  .map((era) => (
                    <button
                      key={era}
                      onClick={() => scrollToSection(era.replace(/\s+/g, "-"))}
                      className="text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-pink-50 hover:text-pink-600 truncate"
                    >
                      {era}
                    </button>
                  ))}
              </div>
            </motion.div>
          )}

          <button
            onClick={() => setShowJumpMenu(!showJumpMenu)}
            className={`p-4 rounded-full shadow-xl transition-all active:scale-90 ${showJumpMenu ? "bg-pink-500 text-white" : "bg-slate-800 text-white"}`}
          >
            <MapIcon className="w-6 h-6" />
          </button>

          {showScrollTop && (
            <motion.button
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: 20}}
              onClick={() => window.scrollTo({top: 0, behavior: "smooth"})}
              className="p-4 bg-white border border-slate-200 text-slate-600 rounded-full shadow-xl hover:bg-slate-50 active:scale-90"
            >
              <ChevronUp className="w-6 h-6" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* SPINNER GLOBAL PDF */}
      <AnimatePresence>
        {loadingPDF && (
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm"
          >
            <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
              <p className="font-black text-slate-800 italic uppercase tracking-tighter">
                Preparing PDF...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
