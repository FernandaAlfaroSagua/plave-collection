export const GlassCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white/30 backdrop-blur-md border border-white/40 shadow-xl rounded-3xl ${className}`}
  >
    {children}
  </div>
);
