export default function EditIconButton({ size = 32 }) {
  return (
    <svg
      width={size}
      height={(size * 31) / 32}
      viewBox="0 0 32 31"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background */}
      <rect width="32" height="31" rx="4" fill="#FFCC00" />

      {/* Edit Icon */}
      <g transform="translate(6,5) scale(1)">
        <path
          d="M8.875 2.85616H2.75C2.28587 2.85616 1.84075 3.04053 1.51256 3.36872C1.18437 3.69691 1 4.14203 1 4.60616V16.8562C1 17.3203 1.18437 17.7654 1.51256 18.0936C1.84075 18.4218 2.28587 18.6062 2.75 18.6062H15C15.4641 18.6062 15.9092 18.4218 16.2374 18.0936C16.5656 17.7654 16.75 17.3203 16.75 16.8562V10.7312M15.4375 1.54366C15.7856 1.19556 16.2577 1 16.75 1C17.2423 1 17.7144 1.19556 18.0625 1.54366C18.4106 1.89175 18.6062 2.36387 18.0625 4.16866L9.75 12.4812L6.25 13.3562L7.125 9.85616L15.4375 1.54366Z"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}