interface Props {
  text: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export const Button = ({
  text,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
  disabled = false,
}: Props) => {
  const styles =
    variant === "primary"
      ? "bg-slate-800 text-white hover:bg-slate-900"
      : "bg-white/50 text-slate-800 hover:bg-white/80";

  return (
    <button
      onClick={onClick}
      className={`px-6 py-2 rounded-xl font-bold transition-all active:scale-95 ${styles} ${className}`}
      type={type}
      disabled={disabled}
    >
      {text}
    </button>
  );
};
