import { useEffect, useRef, useState } from "react";

export function HolographicCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !navigator.gpu || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let mounted = true;
    let dispose = () => {};
    void import("./holographic-card-renderer").then(({ createRenderer }) => {
      if (!mounted) return;
      const renderer = createRenderer(canvas);
      dispose = renderer.dispose;
      void renderer.ready.then(() => {
        if (mounted) setReady(true);
      }).catch(() => {
        // The static card remains visible when WebGPU initialization fails.
      });
    }).catch(() => {
      // Keep the static card if the optional renderer cannot load.
    });

    return () => {
      mounted = false;
      dispose();
    };
  }, []);

  return (
    <div className="holographic-stage mx-auto aspect-[4/5] w-full max-w-[26rem]" aria-label="Tarjeta Agent Ready: de una idea a un cambio verificable">
      <canvas ref={canvasRef} className={`absolute inset-0 h-full w-full touch-none transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}`} aria-hidden="true" />
      <div className={`holographic-face pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col justify-between px-[7%] py-[9%] ${ready ? "holographic-face-ready" : ""}`}>
        <div className="flex items-start justify-between gap-2 text-[9px] font-bold tracking-[.16em] text-mint sm:text-[10px]">
          <span>UNRAF / VIDEOJUEGOS</span><span>01</span>
        </div>
        <div className="flex flex-col items-center text-center">
          <img src={`${import.meta.env.BASE_URL}logounraf.svg`} alt="" className="mb-6 w-[clamp(6rem,27vw,8rem)] drop-shadow-[0_0_16px_rgba(125,249,209,.35)]" />
          <p className="font-display text-[clamp(1.5rem,6vw,2.3rem)] font-black leading-none tracking-[-.05em] text-white">AGENT<br /><span className="text-mint">READY</span></p>
          <p className="mt-3 text-[9px] font-semibold uppercase tracking-[.13em] text-slate-300 sm:text-[10px]">Vos decidís.</p>
        </div>
        <div className="border-t border-mint/25 pt-3 text-[9px] font-semibold leading-5 tracking-[.09em] text-slate-300 sm:text-[10px]">
          <p>IDEA → CAMBIO → EVIDENCIA</p>
          <p className="text-amber">CONTROL HUMANO / SIEMPRE</p>
        </div>
      </div>
    </div>
  );
}
