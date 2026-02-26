export default function DownloadButtonIcon({ size = 36 }) {
  const width = (58 / 48) * size; 

  return (
    <svg
      width={width}
      height={size}
      viewBox="0 0 58 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="58" height="48" rx="4" fill="#2B5A9E" />
      <path
        d="M41 28V33.3333C41 34.0406 40.719 34.7189 40.219 35.219C39.7189 35.719 39.0406 36 38.3333 36H19.6667C18.9594 36 18.2811 35.719 17.781 35.219C17.281 34.7189 17 34.0406 17 33.3333V28M22.3333 21.3333L29 28M29 28L35.6667 21.3333M29 28V12"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}