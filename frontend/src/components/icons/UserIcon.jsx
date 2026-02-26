export default function UserIcon({ size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />

      <circle cx="12" cy="9" r="3" stroke="currentColor" strokeWidth="2" />

      {/* Shoulders */}
      <path
        d="M6 18C6 15.7909 8.68629 14 12 14C15.3137 14 18 15.7909 18 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
