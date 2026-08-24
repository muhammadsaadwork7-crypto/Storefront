import { useMemo, useState } from "react";
import { Pencil, Trash2, Search, Inbox } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DataTable({ columns, data, loading, onEdit, onDelete, searchKeys }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return data;
    const q = query.toLowerCase();
    const keys = searchKeys || columns.map((c) => c.key);
    return data.filter((row) =>
      keys.some((key) => String(row[key] ?? "").toLowerCase().includes(q))
    );
  }, [data, query, columns, searchKeys]);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative w-full max-w-xs">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter rows…"
          className="h-8 pl-8 text-xs"
        />
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    {col.label}
                  </th>
                ))}
                <th className="w-20 px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {loading && (
                <>
                  {[...Array(4)].map((_, i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      {columns.map((col) => (
                        <td key={col.key} className="px-4 py-3">
                          <div className="h-4 w-24 animate-pulse rounded bg-secondary" />
                        </td>
                      ))}
                      <td className="px-4 py-3" />
                    </tr>
                  ))}
                </>
              )}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Inbox className="h-8 w-8 opacity-40" />
                      <p className="text-sm">No records found</p>
                    </div>
                  </td>
                </tr>
              )}

              {!loading &&
                filtered.map((row) => (
                  <tr
                    key={row.id}
                    className="group border-b border-border transition-colors last:border-0 hover:bg-secondary/40"
                  >
                    {columns.map((col) => (
                      <td key={col.key} className={cn("px-4 py-3", col.mono && "font-mono text-xs")}>
                        {col.render ? col.render(row) : row[col.key] ?? "—"}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(row)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => onDelete(row)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {!loading && (
        <p className="text-xs text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "record" : "records"}
          {query && ` matching "${query}"`}
        </p>
      )}
    </div>
  );
}
