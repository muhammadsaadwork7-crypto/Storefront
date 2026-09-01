import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, Upload, Video } from "lucide-react";
import { productMediaApi } from "@/api/productMedia.api";

const BACKEND_URL = "http://localhost:5000";

export default function ProductMediaManager({ productId, productName, onClose }) {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const loadMedia = () => {
    if (!productId) return;
    setLoading(true);
    productMediaApi
      .getAll(productId)
      .then(setMedia)
      .catch(() => setError("Failed to load media"))
      .finally(() => setLoading(false));
  };

  useEffect(loadMedia, [productId]);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      await productMediaApi.upload(productId, files);
      loadMedia();
    } catch (err) {
      setError(err.response?.data?.error || "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (mediaId) => {
    try {
      await productMediaApi.remove(mediaId);
      setMedia((prev) => prev.filter((m) => m.id !== mediaId));
    } catch (err) {
      setError("Failed to delete");
    }
  };

  return (
    <Dialog open={!!productId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Media — {productName}</DialogTitle>
          <DialogDescription>
            Upload multiple images and videos. The first item becomes the primary thumbnail.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {uploading ? "Uploading…" : "Upload images or videos"}
        </Button>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : media.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No media yet — upload some images or a video above.
          </p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {media.map((item) => (
              <div key={item.id} className="relative group rounded-md overflow-hidden border aspect-square">
                {item.media_type === "video" ? (
                  <div className="w-full h-full bg-black flex items-center justify-center">
                    <video src={`${BACKEND_URL}${item.url}`} className="w-full h-full object-cover" muted />
                    <Video className="absolute h-6 w-6 text-white drop-shadow" />
                  </div>
                ) : (
                  <img
                    src={`${BACKEND_URL}${item.url}`}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                )}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
