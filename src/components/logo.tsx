import LogoIcon from "./logo-icon";

export default function Logo() {
  return (
    <div className="flex items-center gap-2 font-headline text-xl font-semibold">
      <LogoIcon className="h-6 w-6 text-primary" />
      <span>D'System</span>
    </div>
  );
}
