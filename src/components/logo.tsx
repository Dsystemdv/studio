import { Flame } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-2 font-headline text-xl font-semibold">
      <Flame className="h-6 w-6 text-primary" />
      <span>D'Manage</span>
    </div>
  );
}
