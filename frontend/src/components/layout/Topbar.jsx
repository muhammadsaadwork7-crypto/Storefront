import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Topbar({ title, description }) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-background/80 px-6 backdrop-blur">
      <div>
        <h1 className="text-sm font-semibold leading-tight">{title}</h1>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="ml-auto flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Quick search…" className="h-8 w-56 pl-8 text-xs" />
        </div>
      </div>
    </header>
  );
}
