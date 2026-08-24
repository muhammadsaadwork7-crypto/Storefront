import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PageHeader({ title, description, actionLabel, onAction }) {
  return (
    <div className="mb-5 flex items-start justify-between">
      <div>
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actionLabel && (
        <Button onClick={onAction} size="sm">
          <Plus className="h-4 w-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
