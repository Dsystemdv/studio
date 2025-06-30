import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  actions?: ReactNode;
};

export default function PageHeader({ title, actions }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 sm:px-6">
      <h1 className="font-headline text-2xl md:text-3xl font-semibold text-foreground">
        {title}
      </h1>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
