export default function Logo() {
  return (
    <div className="flex items-center gap-2 font-headline text-xl font-semibold">
      <svg
        className="h-6 w-6 text-primary"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <text
          x="50%"
          y="55%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontFamily="Alegreya, serif"
          fontSize="14"
          fontWeight="bold"
        >
          D'S
        </text>
      </svg>
      <span>D'System</span>
    </div>
  );
}
