function random(x: number, y: number) {
  const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

export function createAsciiFallback(canvas: HTMLCanvasElement, reducedMotion: boolean) {
  const context = canvas.getContext("2d");
  if (!context) return () => {};
  const section = canvas.parentElement!;
  let pointer = { x: -1000, y: -1000 };
  let targetPointer = { x: -1000, y: -1000 };
  let motion = { x: 0, y: 0 };
  let targetMotion = { x: 0, y: 0 };
  let active = false;
  let hover = 0;
  let frame = 0;
  let lastFrame = -1000;
  let width = 0;
  let height = 0;

  const draw = (time = 0) => {
    if (!reducedMotion && time - lastFrame < 33) {
      frame = requestAnimationFrame(draw);
      return;
    }
    lastFrame = time;
    pointer = {
      x: pointer.x + (targetPointer.x - pointer.x) * 0.18,
      y: pointer.y + (targetPointer.y - pointer.y) * 0.18,
    };
    hover += ((active ? 1 : 0) - hover) * 0.13;
    motion = { x: motion.x + (targetMotion.x - motion.x) * 0.17, y: motion.y + (targetMotion.y - motion.y) * 0.17 };
    targetMotion = { x: targetMotion.x * 0.9, y: targetMotion.y * 0.9 };
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
    const seconds = reducedMotion ? 0 : time / 1000;
    const centerX = width / 12 * 0.6;
    const centerY = height / 12 * 0.5;
    for (let y = 0; y < height / 12; y++) {
      for (let x = 0; x < width / 12; x++) {
        const noise = random(x, y);
        const px = x * 12 + 6;
        const py = y * 12 + 6;
        const dx = px - pointer.x;
        const dy = py - pointer.y;
        const distance = Math.hypot(dx, dy);
        const influence = Math.exp(-(distance * distance) / (230 * 230)) * hover;
        if (noise < 0.42 - influence * 0.3) continue;
        const radius = Math.hypot(x - centerX, (y - centerY) * 0.85);
        const wave = Math.sin(x * 0.18 + Math.sin(y * 0.11 + seconds * 0.34) * 2.2) * 0.55
          + Math.sin(radius * 0.24 - seconds * 0.58) * 0.45;
        const ripple = Math.sin(distance / 30 - seconds * 2) * influence * 0.16;
        const phase = Math.max(0, Math.min(1, (wave + ripple + 0.6) / 1.3));
        const waveShape = phase * phase * (3 - 2 * phase);
        const shape = waveShape + (1 - waveShape) * Math.min(influence * 1.2, 0.78);
        const pulse = Math.sin(seconds * 0.7 + x * 0.08 + y * 0.06) * influence * 0.25;
        const size = Math.max(2.4, Math.min(10.5, 2.4 + shape * 6.1 + noise * 0.5 + influence * 1.6 + pulse));
        // Forward mapping mirrors the shader's inverse sampling near the pointer.
        const flowX = pointer.x + dx * (1 - 0.33 * influence) - dy * 0.065 * influence + motion.x * 1.4 * influence;
        const flowY = pointer.y + dy * (1 - 0.33 * influence) + dx * 0.065 * influence + motion.y * 1.4 * influence;
        const driftX = (Math.sin(py * 0.012 + seconds * 0.82) + Math.sin(px * 0.009 - seconds * 0.47)) * (1.45 + hover * 0.4);
        const driftY = (Math.cos(px * 0.011 + seconds * 0.72) + Math.sin(py * 0.008 - seconds * 0.5)) * (1.45 + hover * 0.4);
        context.fillStyle = `rgba(255, 179, 64, ${0.06 + shape * 0.13 + noise * 0.035 + influence * 0.16})`;
        context.fillRect(flowX + driftX - size / 2, flowY + driftY - size / 2, size, size);
      }
    }
    if (!reducedMotion) frame = requestAnimationFrame(draw);
  };

  const move = (event: PointerEvent) => {
    if (!event.isPrimary || reducedMotion) return;
    if (event.target instanceof Element && event.target.closest(".holographic-stage")) {
      active = false;
      targetMotion = { x: 0, y: 0 };
      return;
    }
    const rect = section.getBoundingClientRect();
    const next = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    if (next.x < 0 || next.y < 0 || next.x > rect.width || next.y > rect.height) {
      active = false;
      return;
    }
    if (active) {
      targetMotion = {
        x: Math.max(-12, Math.min(12, targetMotion.x + (next.x - targetPointer.x) * 0.4)),
        y: Math.max(-12, Math.min(12, targetMotion.y + (next.y - targetPointer.y) * 0.4)),
      };
    } else {
      pointer = next;
    }
    targetPointer = next;
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
