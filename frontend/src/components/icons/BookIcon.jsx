export default function BookIcon({ size = 24, color = "white" }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
      <path d="M6 4H16C17 4 18 5 18 6V20C18 19 17 18 16 18H6V4Z" stroke={color} strokeWidth="2"/>
      <path d="M6 4C5 4 4 5 4 6V20C4 19 5 18 6 18" stroke={color} strokeWidth="2"/>
    </svg>
  );
}