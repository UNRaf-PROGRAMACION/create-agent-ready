import { useEffect, useRef, useState } from "react";
import { createAsciiFallback } from "./ascii-background-fallback";

export function AsciiBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const fallback = fallbackRef.current;
    if (!canvas || !fallback) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let stopFallback = createAsciiFallback(fallback, reducedMotion);
    if (!navigator.gpu || reducedMotion) return () => stopFallback();

    let mounted = true;
    let dispose = () => {};
    void import("./ascii-background-renderer").then(({ createAsciiRenderer }) => {
      if (!mounted) return;
      const renderer = createAsciiRenderer(canvas);
      dispose = renderer.dispose;
      void renderer.ready.then(() => {
        if (mounted) {
          canvas.parentElement?.classList.add("ascii-ready");
          setReady(true);
          stopFallback();
          stopFallback = () => {};
        }
      }).catch(() => {
        // Keep the CSS background if WebGPU is unavailable.
      });
    }).catch(() => {
      // Keep the CSS background if the optional renderer cannot load.
    });

    return () => {
      mounted = false;
      canvas.parentElement?.classList.remove("ascii-ready");
      stopFallback();
      dispose();
    };
  }, []);

  return <>
    <canvas ref={fallbackRef} className={`ascii-background absolute inset-0 h-full w-full pointer-events-none ${ready ? "opacity-0" : "opacity-100"}`} aria-hidden="true" />
    <canvas ref={canvasRef} className={`ascii-background absolute inset-0 h-full w-full pointer-events-none transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}`} aria-hidden="true" />
  </>;
}
