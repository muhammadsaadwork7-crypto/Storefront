import { Loader2 } from "lucide-react";

// A centered spinner + optional message, used while a page's data is loading.
// Usage: if (loading) return <PageLoader />;
export default function PageLoader({ message = "Loading…", fullScreen = true }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 text-gray-500 ${
        fullScreen ? "min-h-screen" : "py-16"
      }`}
    >
      <Loader2 className="h-6 w-6 animate-spin" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
