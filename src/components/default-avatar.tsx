export default function DefaultAvatarSVG({ className = "w-full h-full", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 64 64" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 0.4)" />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 0.1)" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="32" fill="url(#glassGrad)" />
      <path d="M32 38 C 26 48, 38 48, 32 38" fill="rgba(161, 161, 170, 0.7)" />
      <circle cx="24" cy="28" r="2.5" fill="rgba(31, 41, 55, 0.8)" />
      <circle cx="40" cy="28" r="2.5" fill="rgba(31, 41, 55, 0.8)" />
      <path d="M22 18 Q 32 12, 42 18" stroke="rgba(31, 41, 55, 0.8)" strokeWidth="2" fill="none" />
      <ellipse cx="32" cy="52" rx="12" ry="4" fill="rgba(229, 231, 235, 0.6)" />
    </svg>
  );
}
