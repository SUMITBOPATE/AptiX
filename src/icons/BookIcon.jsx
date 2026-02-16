export default function BookIcon({ className = "w-5 h-5" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.002v.008m0-.008v5.25c0 .341-.112.678-.314.945L8 15h8l-3.686-2.8c-.202-.267-.314-.604-.314-.945V6.002Z"
      />
    </svg>
  );
}
