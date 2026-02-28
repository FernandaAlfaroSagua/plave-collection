"use client";

import {useState} from "react";
import {Button} from "./Button";

interface Props {
  name: string;
  era: string;
  type: string;
  imageUrl: string;
  releaseDate: string;
  sortOrder: number;
  action: (formData: FormData) => void;
  selectedMembers?: string[];
  store?: string;
}

export const FormUpload = ({
  name,
  era,
  type,
  imageUrl,
  releaseDate,
  sortOrder,
  action,
  selectedMembers = [],
  store = "",
}: Props) => {
  const members = ["Yejun", "Noah", "Bamby", "Eunho", "Hamin"];
  const types = [
    "Album",
    "POB",
    "Lucky Draw",
    "Event",
    "Merch",
    "Concert",
    "Special Drink",
    "Other",
  ];
  const stores = [
    "Makestar",
    "Vlast Shop",
    "Apple Music",
    "Aladin",
    "Weverse",
    "Yg Select",
    "Ktown4u",
    "Yes24",
    "My Music Taste",
    "Blue Dream Media",
    "Dear My Muse",
    "Pocket CU",
    "fanplee",
    "Hyundai",
    "Olive Young",
    "Whosfan",
    "LG Uplus",
    "Buffz",
    "Musinsa",
    "Hello82",
    "YouTube",
    "HMV",
    "Tower Records",
    "Universal Music Store",
    "Animate",
    "Tiktok",
    "HANABANK",
    "TME",
  ];
  const [selectedType, setSelectedType] = useState(type);
  const formattedDate = releaseDate ? releaseDate.substring(0, 7) : "";
  return (
    <form action={action} className="space-y-6">
      {/* Card Name */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-400 uppercase ml-1">
          Card Name
        </label>
        <input
          name="name"
          type="text"
          defaultValue={name} // Usamos defaultValue para permitir edición
          placeholder="E.g.: Asterum Album Ver. 1"
          className="w-full p-4 rounded-2xl bg-white/60 border-none outline-none focus:ring-2 focus:ring-pink-300"
          required
        />
      </div>

      {/* Era Select */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-400 uppercase ml-1">
          Comeback
        </label>
        <select
          name="era"
          defaultValue={era} // Simplificado con defaultValue en el select
          required
          className="w-full p-4 rounded-2xl bg-white/60 border-none outline-none focus:ring-2 focus:ring-pink-300 appearance-none cursor-pointer text-slate-700 font-medium"
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="Asterum">Asterum</option>
          <option value="Why">Why</option>
          <option value="ASTERUM : The Shape of Things to Come">
            ASTERUM : The Shape of Things to Come
          </option>
          <option value="ASTERUM : 134-1">ASTERUM : 134-1</option>
          <option value="Pump Up The Volume">Pump Up The Volume</option>
          <option value="Caligo Pt.1">Caligo Pt.1</option>
          <option value="Kakurenbo">Kakurenbo</option>
          <option value="PLBBUU">PLBBUU</option>
          <option value="Hello, Asterum!">Team Plave</option>
          <option value="Hello, Asterum!">Hello, Asterum!</option>
          <option value="Hello, Asterum! Encore">Hello, Asterum! Encore</option>
          <option value="Dash: Quantum Leap">Dash: Quantum Leap</option>
          <option value="Dash: Quantum Leap Encore">
            Dash: Quantum Leap Encore
          </option>
          <option value="ASTERUM 433-10">ASTERUM 433-10</option>
          <option value="Season Greeting">Season Greeting</option>
          <option value="Birthday Kit">Birthday Kit</option>
          <option value="Magazine">Magazine</option>
          <option value="Aniplus">Aniplus</option>
          <option value="Animate">Animate</option>
          <option value="Happy Plave Day">Happy Plave Day</option>
          <option value="Membership">Membership</option>
          <option value="Pepero">Pepero</option>
          <option value="Mediheal">Mediheal</option>
          <option value="GS25">GS25</option>
          <option value="Line Friends">Line Friends</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase ml-1">
            Category
          </label>
          <select
            name="type"
            defaultValue={type}
            className="w-full p-4 rounded-2xl bg-white/60 border-none outline-none focus:ring-2 focus:ring-pink-300 appearance-none text-slate-700"
            required
            onChange={(e) => setSelectedType(e.target.value)}
          >
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {(selectedType === "POB" ||
          selectedType === "Lucky Draw" ||
          selectedType === "Event" ||
          selectedType === "Special Drink") && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">
              Store / Benefit Source
            </label>
            <select
              name="store"
              defaultValue={store}
              className="w-full p-4 rounded-2xl bg-white/60 border-none outline-none focus:ring-2 focus:ring-pink-300 appearance-none text-slate-700"
              required={selectedType === "POB"}
            >
              <option value="">Select Store</option>
              {stores.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Image URL */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-400 uppercase ml-1">
          Image URL
        </label>
        <input
          name="imageUrl"
          type="url"
          defaultValue={imageUrl}
          placeholder="https://..."
          className="w-full p-4 rounded-2xl bg-white/60 border-none outline-none focus:ring-2 focus:ring-pink-300"
        />
      </div>

      {/* Selección de Miembros (CORREGIDO) */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-400 uppercase ml-1">
          Members (Select multiple for Units)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {members.map((member) => (
            <label
              key={member}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/40 border border-transparent hover:border-pink-200 cursor-pointer has-[:checked]:bg-pink-50 has-[:checked]:border-pink-300 transition-all"
            >
              <input
                type="checkbox"
                name="members"
                value={member}
                // Verificamos si este miembro está en la lista de seleccionados
                defaultChecked={selectedMembers.includes(member)}
                className="hidden"
              />
              <span className="text-xl">
                {member === "Yejun" && "🐬"}
                {member === "Noah" && "🦙"}
                {member === "Bamby" && "🦌"}
                {member === "Eunho" && "🐺"}
                {member === "Hamin" && "🐈‍⬛"}
              </span>
              <span className="text-[10px] font-black uppercase text-slate-600">
                {member}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Release Date */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase ml-1">
            Release Date
          </label>
          <input
            name="release_date"
            type="month"
            defaultValue={formattedDate}
            required
            className="w-full p-4 rounded-2xl bg-white/60 border-none outline-none focus:ring-2 focus:ring-pink-300"
          />
        </div>

        {/* Sort Order */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase ml-1">
            Order
          </label>
          <input
            name="sort_order"
            type="number"
            defaultValue={sortOrder}
            min={1}
            placeholder="E.g: 1"
            className="w-full p-4 rounded-2xl bg-white/60 border-none outline-none focus:ring-2 focus:ring-pink-300"
          />
        </div>
      </div>

      <div className="pt-4">
        <Button
          text={name ? "UPDATE TREASURE" : "UPLOAD TO ASTERUM"}
          variant="primary"
          className="w-full py-5 text-lg shadow-xl shadow-pink-200"
          type="submit"
        />
      </div>
    </form>
  );
};
