import { clock, effect, frameLoop, init, surface, type Gpu } from "vgpu";
import fragment from "./ascii-background.wgsl?raw";

export function createAsciiRenderer(canvas: HTMLCanvasElement) {
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
    if (disposed) {
      context.dispose();
      return;
    }
    gpu = context;
    const output = surface(context, canvas, { dpr: [1, 2] });
    const shader = effect(context, fragment, {
      label: "agent-ready-ascii-background",
      set: {
        params: {
          resolution: [canvas.clientWidth, canvas.clientHeight],
          pointer: [-1000, -1000],
          motion: [0, 0],
          hover: 0,
          time: 0,
        },
      },
    });
    await shader.compile({ colors: [output.format] });
    if (disposed) return;

    const section = canvas.parentElement!;
    let pointer: [number, number] = [-1000, -1000];
    let targetPointer: [number, number] = [-1000, -1000];
    let motion: [number, number] = [0, 0];
    let targetMotion: [number, number] = [0, 0];
    let active = 0;
    let hover = 0;
    const move = (event: PointerEvent) => {
      if (!event.isPrimary) return;
      const rect = section.getBoundingClientRect();
      const next: [number, number] = [
        event.clientX - rect.left,
        event.clientY - rect.top,
      ];
      if (
        next[0] < 0 ||
        next[1] < 0 ||
        next[0] > rect.width ||
        next[1] > rect.height
      ) {
        active = 0;
        return;
      }
      if (active) {
        targetMotion = [
          Math.max(
            -12,
            Math.min(12, targetMotion[0] + (next[0] - targetPointer[0]) * 0.4),
          ),
          Math.max(
            -12,
            Math.min(12, targetMotion[1] + (next[1] - targetPointer[1]) * 0.4),
          ),
        ];
      } else {
        pointer = next;
      }
      targetPointer = next;
      active = 1;
    };
    const leave = () => {
      active = 0;
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointercancel", leave);
    window.addEventListener("blur", leave);
    const unsubscribeResize = output.onResize(() => {
      shader.set({
        params: { resolution: [canvas.clientWidth, canvas.clientHeight] },
      });
    });
    removeInput = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointercancel", leave);
      window.removeEventListener("blur", leave);
      unsubscribeResize();
    };

    const time = clock(context);
    frameLoop(
      context,
      (frame) => {
        pointer = [
          pointer[0] + (targetPointer[0] - pointer[0]) * 0.18,
          pointer[1] + (targetPointer[1] - pointer[1]) * 0.18,
        ];
        hover += (active - hover) * 0.13;
        motion = [
          motion[0] + (targetMotion[0] - motion[0]) * 0.17,
          motion[1] + (targetMotion[1] - motion[1]) * 0.17,
        ];
        shader.set({ params: { pointer, motion, hover, time: time.time } });
        frame.pass(output, shader);
        targetMotion = [targetMotion[0] * 0.9, targetMotion[1] * 0.9];
      },
      { fps: 30 },
    );
  })().catch((error: unknown) => {
    if (disposed) return;
    dispose();
    throw error;
  });

  return { ready, dispose };
}
