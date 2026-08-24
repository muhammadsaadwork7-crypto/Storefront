import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

// Shows a brief animated bar at the very top of the screen every time the
// route changes — purely visual feedback that "something happened" on
// navigation, since client-side route changes are instant and can feel
// abrupt without it.
export default function RouteLoadingBar() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    setVisible(true);
    clearTimeout(timeoutRef.current);
    // Keep the bar visible just long enough to register as intentional
    // feedback, then fade it out. This is a fixed-duration bar, not tied
    // to real data loading — real per-page loading is handled separately
    // by PageLoader inside each page.
    timeoutRef.current = setTimeout(() => setVisible(false), 400);

    return () => clearTimeout(timeoutRef.current);
  }, [location.pathname]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-0.5 bg-gray-200 overflow-hidden">
      <div className="h-full bg-black animate-route-loading-bar" />
    </div>
  );
}
