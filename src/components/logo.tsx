export default function Logo() {
  return (
    <div className="flex items-center gap-2 font-headline text-xl font-semibold">
      <svg
        className="h-6 w-6 text-primary"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M8 4h5a6 6 0 0 1 6 6v4a6 6 0 0 1-6 6H8V4z" />
      </svg>
      <span>D'System</span>
    </div>
  );
}
