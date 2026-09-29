import { clock, effect, frameLoop, init, surface, type Gpu } from "vgpu";
import fragment from "./holographic-card.wgsl?raw";

// Adapted from https://vgpu.sh/examples/holographic-card/source.md
export function createRenderer(canvas: HTMLCanvasElement) {
  let disposed = false;
  let gpu: Gpu | undefined;
  let removeInput = () => {};

  const dispose = () => {
    if (disposed) return;
    disposed = true;
    removeInput();
    gpu?.dispose();
  };

  const ready = (async () => {
    const context = await init();
    if (disposed) { context.dispose(); return; }
    gpu = context;
    const output = surface(context, canvas, { dpr: [1, 2] });
    const shader = effect(context, fragment, {
      label: "agent-ready-holographic-card",
      set: { params: { resolution: output.size, tilt: [0, 0], pointer: [0.2, -0.25], hover: 0 } },
    });
    await shader.compile({ colors: [output.format] });
    if (disposed) return;

    let targetHover = 0;
    let pointerX = 0;
    let pointerY = 0;
    let tiltX = 0;
    let tiltY = 0;
    let hover = 0;
    let lightX = 0.2;
    let lightY = -0.25;
    const move = (event: PointerEvent) => {
      if (!event.isPrimary) return;
      const rect = canvas.getBoundingClientRect();
      const scale = Math.min(rect.height, rect.width * 1.35);
      canvas.parentElement?.style.setProperty("--shine-x", `${(event.clientX - rect.left) / rect.width * 100}%`);
      canvas.parentElement?.style.setProperty("--shine-y", `${(event.clientY - rect.top) / rect.height * 100}%`);
      pointerX = (event.clientX - rect.left - rect.width / 2) / Math.max(1, scale) * 1.85 / 0.64;
      pointerY = (event.clientY - rect.top - rect.height / 2) / Math.max(1, scale) * 1.85 / 0.91;
      const dx = Math.max(0, Math.abs(pointerX) - 1);
      const dy = Math.max(0, Math.abs(pointerY) - 1);
      targetHover = Math.max(0, 1 - Math.hypot(dx, dy) / 1.5);
    };
    const leave = () => { targetHover = 0; };
    const up = (event: PointerEvent) => { if (event.pointerType !== "mouse") leave(); };
    canvas.addEventListener("pointermove", move, { passive: true });
    canvas.addEventListener("pointerdown", move, { passive: true });
    canvas.addEventListener("pointerleave", leave);
    canvas.addEventListener("pointercancel", leave);
    canvas.addEventListener("pointerup", up);
    const unsubscribeResize = output.onResize(() => {
      shader.set({ params: { resolution: output.size } });
    });
    removeInput = () => {
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerdown", move);
      canvas.removeEventListener("pointerleave", leave);
      canvas.removeEventListener("pointercancel", leave);
      canvas.removeEventListener("pointerup", up);
      unsubscribeResize();
    };

    const time = clock(context);
    frameLoop(context, (currentFrame) => {
      const blend = 1 - Math.exp(-10 * Math.min(time.deltaTime, 0.1));
      tiltX += (Math.max(-1, Math.min(1, pointerX)) * 0.12 * targetHover - tiltX) * blend;
      tiltY += (-Math.max(-1, Math.min(1, pointerY)) * 0.09 * targetHover - tiltY) * blend;
      hover += (targetHover - hover) * blend;
      if (targetHover > 0) {
        lightX += (pointerX - lightX) * blend;
        lightY += (pointerY - lightY) * blend;
      }
      shader.set({ params: { tilt: [tiltX, tiltY], pointer: [lightX, lightY], hover } });
      currentFrame.pass(output, shader);
    }, { fps: 30 });
  })().catch((error: unknown) => {
    if (disposed) return;
    dispose();
    throw error;
  });

  return { ready, dispose };
}
