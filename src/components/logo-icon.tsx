import { cn } from "@/lib/utils";

type LogoIconProps = {
  className?: string;
};

export default function LogoIcon({ className }: LogoIconProps) {
  return (
    <svg
      className={cn("transition-all group-hover:scale-110", className)}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        x="50%"
        y="55%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="14"
        fontWeight="bold"
      >
        D'S
      </text>
    </svg>
  );
}
