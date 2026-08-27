// Decorative gradient shapes + a faint dot grid, positioned toward the
// edges so they frame the hero text instead of sitting directly behind it.
// Uses radial gradients (not flat fills) for a softer, richer look, and
// pointer-events-none so nothing here ever blocks clicks.
export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Faint dot grid texture */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #94a3b8 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Large soft gradient blob, top-left */}
      <div
        className="absolute -top-32 -left-32 w-[32rem] h-[32rem] rounded-full animate-blob-1"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(139,92,246,0.35), rgba(139,92,246,0) 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Large soft gradient blob, top-right */}
      <div
        className="absolute -top-24 -right-24 w-[28rem] h-[28rem] rounded-full animate-blob-2"
        style={{
          background:
            "radial-gradient(circle at 70% 30%, rgba(244,114,182,0.3), rgba(244,114,182,0) 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Softer accent blob, bottom-center */}
      <div
        className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[34rem] h-[24rem] rounded-full animate-blob-3"
        style={{
          background:
            "radial-gradient(circle, rgba(56,189,248,0.25), rgba(56,189,248,0) 70%)",
          filter: "blur(70px)",
        }}
      />

      {/* Soft vignette so shapes fade out near the edges of the section */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/0 to-white" />
    </div>
  );
}
