import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

/** Mono "Scroll" label with a slow chevron bounce, fades out after the first scroll. */
export function ScrollHint() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (window.scrollY > 8) {
      setGone(true);
      return;
    }
    const onScroll = () => {
      if (window.scrollY > 8) setGone(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none flex flex-col items-center gap-2 text-white/60 transition-opacity duration-500 ${
        gone ? "opacity-0" : "opacity-100"
      }`}
    >
      <span className="label-mono-up">Scroll</span>
      <ChevronDown className="h-4 w-4 motion-safe:animate-[bounce_2.4s_ease-in-out_infinite]" />
    </div>
  );
}

export default ScrollHint;
