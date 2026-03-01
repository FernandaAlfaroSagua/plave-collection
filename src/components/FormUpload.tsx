"use client";

import {useState} from "react";
import Select from "react-select";
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

  // Transformamos arrays a formato { value, label } para react-select
  const eraOptions = [
    "Asterum",
    "Why",
    "ASTERUM : The Shape of Things to Come",
    "ASTERUM : 134-1",
    "Pump Up The Volume",
    "Caligo Pt.1",
    "Kakurenbo",
    "PLBBUU",
    "Team Plave",
    "Hello, Asterum!",
    "Hello, Asterum! Encore",
    "Dash: Quantum Leap",
    "Dash: Quantum Leap Encore",
    "ASTERUM 433-10",
    "Season Greeting",
    "Birthday Kit",
    "Magazine",
    "Aniplus",
    "Animate",
    "Happy Plave Day",
    "Membership",
    "Pepero",
    "Mediheal",
    "GS25",
    "Line Friends",
    "Other",
  ].map((e) => ({value: e, label: e}));

  const typeOptions = [
    "Album",
    "POB",
    "Lucky Draw",
    "Event",
    "Merch",
    "Concert",
    "Special Drink",
    "Other",
  ].map((t) => ({value: t, label: t}));

  const storeOptions = [
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
  ].map((s) => ({value: s, label: s}));

  const [selectedType, setSelectedType] = useState(type);

  // Estilos personalizados para mantener la estética Glassmorphism
  const customStyles = {
    control: (base: any) => ({
      ...base,
      padding: "8px",
      borderRadius: "1rem",
      backgroundColor: "rgba(255, 255, 255, 0.6)",
      border: "none",
      boxShadow: "none",
      "&:hover": {border: "none"},
    }),
    menu: (base: any) => ({
      ...base,
      borderRadius: "1rem",
      overflow: "hidden",
      padding: "8px",
    }),
    option: (base: any, state: any) => ({
      ...base,
      borderRadius: "0.5rem",
      backgroundColor: state.isSelected
        ? "#f472b6"
        : state.isFocused
          ? "#fdf2f8"
          : "transparent",
      color: state.isSelected ? "white" : "#475569",
      fontWeight: "600",
      fontSize: "0.875rem",
    }),
  };

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
          defaultValue={name}
          className="w-full p-4 rounded-2xl bg-white/60 border-none outline-none focus:ring-2 focus:ring-pink-300"
          required
        />
      </div>

      {/* Era Select (React Select) */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-400 uppercase ml-1">
          Comeback / Era
        </label>
        <Select
          name="era"
          options={eraOptions}
          defaultValue={eraOptions.find((o) => o.value === era)}
          styles={customStyles}
          placeholder="Search era..."
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase ml-1">
            Category
          </label>
          <Select
            name="type"
            options={typeOptions}
            defaultValue={typeOptions.find((o) => o.value === type)}
            styles={customStyles}
            onChange={(val) => setSelectedType(val?.value || "")}
            required
          />
        </div>

        {/* Store Select (Condicional) */}
        {(selectedType === "POB" ||
          selectedType === "Lucky Draw" ||
          selectedType === "Event" ||
          selectedType === "Special Drink") && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">
              Store Source
            </label>
            <Select
              name="store"
              options={storeOptions}
              defaultValue={storeOptions.find((o) => o.value === store)}
              styles={customStyles}
              placeholder="Search store..."
            />
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
          className="w-full p-4 rounded-2xl bg-white/60 border-none outline-none focus:ring-2 focus:ring-pink-300"
        />
      </div>

      {/* Members Selection (Checkboxes se mantienen igual por UX) */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-400 uppercase ml-1">
          Members
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
                defaultChecked={selectedMembers.includes(member)}
                className="hidden"
              />
              <span className="text-xl">
                {member === "Yejun" && "🐬"} {member === "Noah" && "🦙"}{" "}
                {member === "Bamby" && "🦌"} {member === "Eunho" && "🐺"}{" "}
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
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase ml-1">
            Release Date
          </label>
          <input
            name="release_date"
            type="month"
            defaultValue={formattedDate}
            required
            className="w-full p-4 rounded-2xl bg-white/60 outline-none focus:ring-2 focus:ring-pink-300 border-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase ml-1">
            Order
          </label>
          <input
            name="sort_order"
            type="number"
            defaultValue={sortOrder}
            className="w-full p-4 rounded-2xl bg-white/60 outline-none focus:ring-2 focus:ring-pink-300 border-none"
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
