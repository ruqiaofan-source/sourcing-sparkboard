import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface HeroVideoProps {
  className?: string;
  /** Extra classes for the media element, used to shift the packaging stack. */
  mediaClassName?: string;
  alt: string;
}

const POSTER = "/hero/hero-poster.jpg";

/**
 * Seamless hero loop. Shows the poster only when the visitor prefers reduced
 * motion, and pauses playback while the hero is out of view.
 */
export function HeroVideo({ className, mediaClassName, alt }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || reduced) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            void el.play().catch(() => undefined);
          } else {
            el.pause();
          }
        });
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduced]);

  if (reduced) {
    return (
      <div className={className}>
        <img src={POSTER} alt={alt} className={cn("h-full w-full object-cover", mediaClassName)} />
      </div>
    );
  }

  return (
    <div className={className}>
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={POSTER}
        aria-label={alt}
        className={cn("h-full w-full object-cover", mediaClassName)}
      >
        <source src="/hero/hero-loop.webm" type="video/webm" />
        <source src="/hero/hero-loop.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

export default HeroVideo;
