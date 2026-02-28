"use client";

import {useMemo, useState} from "react";
import {Search, Download, Plus, FilterX} from "lucide-react";
import {Photocard} from "./Photocard";
import {toggleCollection} from "@/actions/auth";
import {Card} from "@/types/photocard.type";
import Link from "next/link";
import {generateCollectionPDF} from "@/lib/exportPdf";

interface Props {
  readonly initialCards: Card[];
  readonly isAdmin: boolean;
}

export default function DashboardContent({initialCards, isAdmin}: Props) {
  const [filter, setFilter] = useState("All"); // Miembros
  const [statusFilter, setStatusFilter] = useState("All"); // Owned / Wishlist
  const [eraFilter, setEraFilter] = useState("All"); // Por Era específica
  const [searchQuery, setSearchQuery] = useState("");
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [loadingPDF, setLoadingPDF] = useState(false);

  const members = ["All", "Yejun", "Noah", "Bamby", "Eunho", "Hamin"];

  const allEras = useMemo(() => {
    const uniqueEras = Array.from(new Set(initialCards.map((c) => c.era)));
    return ["All", ...uniqueEras];
  }, [initialCards]);

  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      const matchesMember = filter === "All" || card.members.includes(filter);
      const matchesEra = eraFilter === "All" || card.era === eraFilter;
      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Owned" ? card.isCollected : !card.isCollected);

      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        card.name.toLowerCase().includes(searchLower) ||
        card.type.toLowerCase().includes(searchLower) ||
        card.era.toLowerCase().includes(searchLower);

      return matchesMember && matchesEra && matchesStatus && matchesSearch;
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

    // 👇 DEBUG: imprimir fecha más reciente por era
    console.log("===== ERA DEBUG =====");
    for (const [era, timestamp] of eraMap.entries()) {
      console.log(era, "->", new Date(timestamp).toISOString().split("T")[0]);
    }

    return Array.from(eraMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([era]) => era);
  }, [cards]);

  const resetFilters = () => {
    setFilter("All");
    setStatusFilter("All");
    setEraFilter("All");
    setSearchQuery("");
  };

  const handleToggle = async (cardId: number) => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === cardId ? {...c, isCollected: !c.isCollected} : c,
      ),
    );
    await toggleCollection(cardId);
  };

  const hasFilters =
    filter !== "All" ||
    statusFilter !== "All" ||
    eraFilter !== "All" ||
    searchQuery !== "";

  return (
    <div className="p-6 max-w-7xl mx-auto">
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
              className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2 text-xs font-bold shadow-sm cursor-pointer"
              disabled={loadingPDF}
            >
              {loadingPDF ? (
                <svg
                  className="animate-spin h-4 w-4 text-pink-500"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              ) : (
                <Download className="w-4 h-4 text-pink-500" />
              )}
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
              className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2 text-xs font-bold shadow-sm cursor-pointer"
              disabled={loadingPDF}
            >
              {loadingPDF ? (
                <svg
                  className="animate-spin h-4 w-4 text-slate-400"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              ) : (
                <Download className="w-4 h-4 text-slate-400" />
              )}
              WISHLIST
            </button>
            {/* Spinner global si loadingPDF */}
            {loadingPDF && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-2xl shadow-xl">
                  <svg
                    className="animate-spin h-8 w-8 text-pink-500"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  <span className="text-pink-500 font-bold">
                    Generando PDF...
                  </span>
                </div>
              </div>
            )}
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
              placeholder="Search by name, type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-pink-300 text-sm"
            />
          </div>
        </div>
      </header>

      {/* FILTROS AVANZADOS */}
      <div className="flex flex-col gap-6 mb-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Pills de Miembros */}
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar flex-1">
            {members.map((m) => (
              <button
                key={m}
                onClick={() => setFilter(m)}
                className={`px-5 py-2 rounded-full font-bold text-xs border transition-all whitespace-nowrap ${
                  filter === m
                    ? "bg-slate-800 text-white border-slate-800 shadow-lg"
                    : "bg-white text-slate-500 border-slate-200 hover:border-pink-200"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Selectores de Estado y Era */}
          <div className="flex gap-2 w-full md:w-auto pb-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-pink-300 flex-1 md:flex-none cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Owned">Collected ✅</option>
              <option value="Wishlist">Missing 💎</option>
            </select>

            <select
              value={eraFilter}
              onChange={(e) => setEraFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-pink-300 flex-1 md:flex-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              {sortedEras
                .filter((e) => e !== "All")
                .map((era) => (
                  <option key={era} value={era}>
                    {era}
                  </option>
                ))}
            </select>

            {hasFilters && (
              <button
                onClick={resetFilters}
                className="p-2 bg-pink-50 text-pink-500 rounded-xl hover:bg-pink-100 transition-colors"
                title="Clear Filters"
              >
                <FilterX className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Contador de resultados */}
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
          {filteredCards.length}{" "}
          {filteredCards.length === 1 ? "treasure" : "treasures"} found
        </p>
      </div>

      {/* SECCIONES POR ERA */}
      <div className="space-y-16">
        {sortedEras
          .filter((era) => filteredCards.some((c) => c.era === era))
          .map((era) => {
            const cardsInEra = filteredCards
              .filter((c) => c.era === era)
              .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

            return (
              <section key={era}>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest">
                    {era}
                  </h2>
                  <div className="h-[2px] flex-1 bg-slate-100"></div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
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
      </div>

      {/* Empty State */}
      {filteredCards.length === 0 && (
        <div className="text-center py-32 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-bold italic mb-4">
            No treasures found in this sector of Asterum 🌌
          </p>
          {hasFilters && (
            <button
              onClick={resetFilters}
              className="text-pink-500 font-bold text-sm hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
