import { useEffect, useRef } from "react";
import { guideHref, guides } from "../content/guides";

const asset = (name: string) => `${import.meta.env.BASE_URL}${encodeURIComponent(name)}`;

function FooterAtmosphere({ footerRef, buildingRef }: { footerRef: React.RefObject<HTMLElement | null>; buildingRef: React.RefObject<HTMLImageElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    const building = buildingRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!footer || !building || !canvas || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let pointerX = -1000;
    let pointerY = -1000;
    let targetPointerX = -1000;
    let targetPointerY = -1000;
    let hover = 0;
    let active = 0;
    let motionX = 0;
    let motionY = 0;
    let targetMotionX = 0;
    let targetMotionY = 0;
    let lastDraw = 0;
    let visible = false;

    const draw = (time: number) => {
      const width = footer.clientWidth;
      const height = footer.clientHeight;
      context.clearRect(0, 0, width, height);
      const glyphs = ["+", ".", ":", "·"];
      const radius = 290;
      const step = 17;
      context.fillStyle = "#c4ffe9";
      for (let y = 16; y < height; y += 30) {
        for (let x = 16; x < width; x += 30) {
          const noise = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1;
          if (noise < 0.68) continue;
          context.globalAlpha = 0.12 + noise * 0.14 + Math.sin(time * 1.3 + noise * 10) * 0.05;
          context.fillText("·", x + Math.sin(time * 0.7 + y * 0.03) * 3, y + Math.cos(time * 0.6 + x * 0.03) * 3);
        }
      }
      if (hover >= 0.01) {
        for (let y = Math.max(12, Math.floor((pointerY - radius) / step) * step); y < Math.min(height, pointerY + radius); y += step) {
          for (let x = Math.max(12, Math.floor((pointerX - radius) / step) * step); x < Math.min(width, pointerX + radius); x += step) {
            const distance = Math.hypot(x - pointerX, y - pointerY);
            const noise = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1;
            if (distance > radius || noise < 0.32) continue;
            const influence = 1 - distance / radius;
            const driftX = Math.sin(time * 1.8 + y * 0.045) * 5 + motionX * influence;
            const driftY = Math.cos(time * 1.5 + x * 0.04) * 4 + motionY * influence;
            context.globalAlpha = Math.pow(influence, 0.75) * hover * (0.76 + Math.sin(time * 2 + noise * 12) * 0.18);
            context.fillText(glyphs[Math.floor(noise * glyphs.length)], x + driftX, y + driftY);
          }
        }
      }
      context.globalAlpha = 1;
      if (building.complete && building.naturalWidth > 0) {
        const footerRect = footer.getBoundingClientRect();
        const buildingRect = building.getBoundingClientRect();
        context.globalCompositeOperation = "destination-out";
        context.drawImage(building, buildingRect.left - footerRect.left, buildingRect.top - footerRect.top, buildingRect.width, buildingRect.height);
        context.globalCompositeOperation = "source-over";
      }
    };

    const resize = () => {
      const width = footer.clientWidth;
      const height = footer.clientHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.font = "12px monospace";
      draw(performance.now() / 1000);
    };

    const animate = (time: number) => {
      currentX += (targetX - currentX) * 0.09;
      currentY += (targetY - currentY) * 0.09;
      pointerX += (targetPointerX - pointerX) * 0.22;
      pointerY += (targetPointerY - pointerY) * 0.22;
      hover += (active - hover) * 0.16;
      motionX += (targetMotionX - motionX) * 0.17;
      motionY += (targetMotionY - motionY) * 0.17;
      targetMotionX *= 0.87;
      targetMotionY *= 0.87;
      footer.style.setProperty("--footer-sky-x", `${currentX * -10}px`);
      footer.style.setProperty("--footer-sky-y", `${currentY * -7}px`);
      if (time - lastDraw >= 33) {
        draw(time / 1000);
        lastDraw = time;
      }
      if (visible) {
        frame = requestAnimationFrame(animate);
      } else {
        frame = 0;
      }
    };

    const move = (event: PointerEvent) => {
      if (!event.isPrimary || event.pointerType === "touch") return;
      const rect = footer.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      targetX = x * 2 - 1;
      targetY = y * 2 - 1;
      if (active) {
        targetMotionX = Math.max(-12, Math.min(12, targetMotionX + (event.clientX - rect.left - targetPointerX) * 0.45));
        targetMotionY = Math.max(-12, Math.min(12, targetMotionY + (event.clientY - rect.top - targetPointerY) * 0.45));
      }
      targetPointerX = event.clientX - rect.left;
      targetPointerY = event.clientY - rect.top;
      if (!active) {
        pointerX = targetPointerX;
        pointerY = targetPointerY;
      }
      active = 1;
      if (visible && !frame) frame = requestAnimationFrame(animate);
    };
    const leave = () => {
      targetX = 0;
      targetY = 0;
      active = 0;
      targetMotionX = 0;
      targetMotionY = 0;
      if (visible && !frame) frame = requestAnimationFrame(animate);
    };
    const refresh = () => {
      draw(performance.now() / 1000);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(footer);
    resize();
    building.addEventListener("load", refresh);
    let visibilityObserver: IntersectionObserver | undefined;
    if (!reducedMotion) {
      visibilityObserver = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !frame) frame = requestAnimationFrame(animate);
        if (!visible) {
          cancelAnimationFrame(frame);
          frame = 0;
          active = 0;
          hover = 0;
        }
      });
      visibilityObserver.observe(footer);
      footer.addEventListener("pointermove", move, { passive: true });
      footer.addEventListener("pointerleave", leave);
    }
    return () => {
      observer.disconnect();
      visibilityObserver?.disconnect();
      cancelAnimationFrame(frame);
      footer.removeEventListener("pointermove", move);
      footer.removeEventListener("pointerleave", leave);
      building.removeEventListener("load", refresh);
    };
  }, [footerRef, buildingRef]);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-[4] h-full w-full" aria-hidden="true" />;
}

export function SiteFooter() {
  const footerRef = useRef<HTMLElement>(null);
  const buildingRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    const building = buildingRef.current;
    if (!footer || !building || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = footer.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / rect.height));
      const eased = progress * progress * (3 - 2 * progress);
      const height = building.getBoundingClientRect().height;
      // The first third of the transparent PNG is sky; align the visible roof with the footer's top edge.
      const end = rect.height - height;
      const start = Math.min(-height * 0.31, end - 24);
      footer.style.setProperty("--footer-building-top", `${start + (end - start) * eased}px`);
      footer.style.setProperty("--footer-building-bottom", "auto");
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const observer = new ResizeObserver(schedule);
    observer.observe(footer);
    observer.observe(building);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    building.addEventListener("load", schedule);
    schedule();

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      building.removeEventListener("load", schedule);
    };
  }, []);

  return (
    <footer ref={footerRef} className="site-footer relative isolate min-h-[100svh] overflow-hidden border-t border-white/10 bg-[#081528] text-white">
      <img src={asset("cielo.png")} alt="" className="site-footer-sky pointer-events-none absolute inset-0 h-full w-full object-cover" aria-hidden="true" />
      <FooterAtmosphere footerRef={footerRef} buildingRef={buildingRef} />
      <img ref={buildingRef} src={asset("edificiounraf.png")} alt="" className="site-footer-building pointer-events-none absolute z-[2]" aria-hidden="true" />
      <div className="site-footer-scrim pointer-events-none absolute inset-0 z-[3]" aria-hidden="true" />

      <div className="relative z-[5] mx-auto flex min-h-[100svh] max-w-7xl flex-col px-5 pb-[clamp(7rem,12vw,11rem)] pt-12 sm:pt-16 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.1fr_1fr_1fr] lg:gap-16">
          <nav aria-label="Enlaces del sitio">
            <p className="mb-5 text-xs font-bold uppercase tracking-[.18em] text-mint">Explorá</p>
            <ul className="space-y-3 text-sm text-white/85">
              <li><a className="site-footer-link" href={import.meta.env.BASE_URL}>Inicio</a></li>
              {guides.map((guide) => <li key={guide.id}><a className="site-footer-link" href={guideHref(guide.id)}>{guide.eyebrow}</a></li>)}
            </ul>
          </nav>
          <div>
            <p className="mb-5 text-xs font-bold uppercase tracking-[.18em] text-mint">Proyecto</p>
            <a className="site-footer-link text-sm text-white/85" href="https://github.com/UNRaf-PROGRAMACION/create-agent-ready" target="_blank" rel="noreferrer">Repositorio en GitHub ↗</a>
            <p className="mt-5 max-w-xs text-sm leading-6 text-white/65">Un punto de partida para crear videojuegos con agentes, contexto y criterio propio.</p>
            <p className="mb-3 mt-6 text-xs font-bold uppercase tracking-[.18em] text-mint">Workshop para</p>
            <a className="site-footer-link block max-w-xs text-sm leading-6 text-white/85" href="https://www.unraf.edu.ar/que-estudio/licenciaturas-e-ingenieria?view=article&id=2860:carrera-7&catid=155" target="_blank" rel="noreferrer">LICENCIATURA EN PRODUCCIÓN DE VIDEOJUEGOS Y ENTRETENIMIENTO DIGITAL ↗</a>
          </div>
          <div>
            <p className="mb-5 text-xs font-bold uppercase tracking-[.18em] text-mint">Hecho por personas</p>
            <p className="text-sm font-semibold">Made with <span role="img" aria-label="amor">❤️</span> · Desarrollo Tecnológico 2</p>
            <p className="mt-5 text-xs uppercase tracking-[.14em] text-white/60">By</p>
            <div className="mt-2 flex flex-col items-start gap-2 text-sm text-white/85">
              <a className="site-footer-link" href="https://www.linkedin.com/in/nicolasnocete/" target="_blank" rel="noreferrer">Nicolás Nocete ↗</a>
              <a className="site-footer-link" href="https://www.linkedin.com/in/agusstin-galvan/" target="_blank" rel="noreferrer">Agustín Galván ↗</a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
