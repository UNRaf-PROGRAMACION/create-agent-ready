const CHARS = ["0", "1", ".", "·", ":", "*", "x", "+"];

function random(x: number, y: number) {
  const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

export function createAsciiFallback(canvas: HTMLCanvasElement, reducedMotion: boolean) {
  const context = canvas.getContext("2d");
  if (!context) return () => {};
  const section = canvas.parentElement!;
  let pointer = { x: -1000, y: -1000 };
  let motion = { x: 0, y: 0 };
  let targetMotion = { x: 0, y: 0 };
  let active = false;
  let frame = 0;
  let width = 0;
  let height = 0;

  const draw = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const nextWidth = section.clientWidth;
    const nextHeight = section.clientHeight;
    if (width !== nextWidth || height !== nextHeight || canvas.width !== Math.round(width * ratio)) {
      width = nextWidth;
      height = nextHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
    }
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);
    context.font = "bold 14px monospace";
    context.textAlign = "center";
    context.textBaseline = "middle";
    for (let y = 0; y < height / 16; y++) {
      for (let x = 0; x < width / 16; x++) {
        const seed = random(x, y);
        if (seed < 0.4) continue;
        const px = x * 16 + 8;
        const py = y * 16 + 8;
        const dx = px - pointer.x;
        const dy = py - pointer.y;
        const distance = Math.hypot(dx, dy);
        const influence = Math.exp(-(distance * distance) / (200 * 200));
        const light = active ? Math.max(0, 1 - distance / 400) : 0;
        context.fillStyle = `rgba(255, 190, 92, ${0.17 + light * 0.54})`;
        context.fillText(CHARS[Math.floor(random(x + 37, y + 91) * CHARS.length)], px + motion.x * influence, py + motion.y * influence);
      }
    }
    motion = { x: motion.x + (targetMotion.x - motion.x) * 0.22, y: motion.y + (targetMotion.y - motion.y) * 0.22 };
    targetMotion = { x: targetMotion.x * 0.86, y: targetMotion.y * 0.86 };
    if (!reducedMotion) frame = requestAnimationFrame(draw);
  };

  const move = (event: PointerEvent) => {
    if (!event.isPrimary || reducedMotion) return;
    const rect = section.getBoundingClientRect();
    const next = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    if (next.x < 0 || next.y < 0 || next.x > rect.width || next.y > rect.height) {
      active = false;
      return;
    }
    if (active) {
      targetMotion = {
        x: Math.max(-12, Math.min(12, targetMotion.x + (next.x - pointer.x) * 0.5)),
        y: Math.max(-12, Math.min(12, targetMotion.y + (next.y - pointer.y) * 0.5)),
      };
    }
    pointer = next;
    active = true;
  };
  const leave = () => { active = false; };
  window.addEventListener("pointermove", move, { passive: true });
  window.addEventListener("pointercancel", leave);
  window.addEventListener("blur", leave);
  draw();

  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointercancel", leave);
    window.removeEventListener("blur", leave);
  };
}
