import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BACKEND_URL = "http://localhost:5000";

export default function MediaGallery({ media }) {
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const scrollStartX = useRef(0);

  if (!media || media.length === 0) {
    return (
      <div className="aspect-square bg-white border rounded-lg flex items-center justify-center">
        <span className="text-6xl text-gray-200 font-bold">?</span>
      </div>
    );
  }

  const scrollToIndex = (index) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(media.length - 1, index));
    track.scrollTo({ left: clamped * track.clientWidth, behavior: "smooth" });
    setActiveIndex(clamped);
  };

  // Cursor drag-to-slide (desktop). Touch devices already scroll natively.
  const handlePointerDown = (e) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    scrollStartX.current = trackRef.current.scrollLeft;
    trackRef.current.style.scrollBehavior = "auto";
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    const delta = e.clientX - dragStartX.current;
    trackRef.current.scrollLeft = scrollStartX.current - delta;
  };

  const endDrag = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const track = trackRef.current;
    track.style.scrollBehavior = "smooth";
    // Snap to the nearest slide based on current scroll position
    const nearest = Math.round(track.scrollLeft / track.clientWidth);
    scrollToIndex(nearest);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Main slider */}
      <div className="relative">
        <div
          ref={trackRef}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={endDrag}
          onMouseLeave={endDrag}
          onScroll={(e) => {
            if (isDragging.current) return;
            const track = e.currentTarget;
            const index = Math.round(track.scrollLeft / track.clientWidth);
            setActiveIndex(index);
          }}
          className="aspect-square bg-white border rounded-lg overflow-x-auto flex snap-x snap-mandatory cursor-grab active:cursor-grabbing select-none"
          style={{ scrollbarWidth: "none" }}
        >
          {media.map((item, i) => (
            <div key={item.id ?? i} className="w-full h-full shrink-0 snap-center flex items-center justify-center">
              {item.media_type === "video" ? (
                <video
                  src={`${BACKEND_URL}${item.url}`}
                  controls
                  className="w-full h-full object-cover pointer-events-auto"
                />
              ) : (
                <img
                  src={`${BACKEND_URL}${item.url}`}
                  alt=""
                  draggable={false}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          ))}
        </div>

        {media.length > 1 && (
          <>
            <button
              onClick={() => scrollToIndex(activeIndex - 1)}
              disabled={activeIndex === 0}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 border rounded-full p-1.5 shadow-sm disabled:opacity-0 transition-opacity"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scrollToIndex(activeIndex + 1)}
              disabled={activeIndex === media.length - 1}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 border rounded-full p-1.5 shadow-sm disabled:opacity-0 transition-opacity"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {media.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {media.map((item, i) => (
            <button
              key={item.id ?? i}
              onClick={() => scrollToIndex(i)}
              className={`shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                activeIndex === i ? "border-black" : "border-transparent"
              }`}
            >
              {item.media_type === "video" ? (
                <video src={`${BACKEND_URL}${item.url}`} className="w-full h-full object-cover" muted />
              ) : (
                <img src={`${BACKEND_URL}${item.url}`} alt="" className="w-full h-full object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
