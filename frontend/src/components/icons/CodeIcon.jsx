export default function CodeIcon({ size = 24, color = "white" }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
      <path d="M16 18L20 12L16 6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M8 18L4 12L8 6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M14 4L10 20" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}