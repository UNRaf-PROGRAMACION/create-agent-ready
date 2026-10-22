import { Check, Copy, TriangleAlert } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function CopyCodeButton({ value }: { value: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const resetTimer = useRef<number | null>(null);

  useEffect(() => () => {
    if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
  }, []);

  async function copy() {
    if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
    try {
      await navigator.clipboard.writeText(value.trim());
      setStatus("copied");
    } catch {
      setStatus("error");
    }
    resetTimer.current = window.setTimeout(() => setStatus("idle"), 2500);
  }

  return (
    <button className="copy-button" type="button" onClick={copy} aria-label="Copiar comando" data-state={status}>
      {status === "copied" ? <Check className="size-4 text-mint" aria-hidden="true" /> : status === "error" ? <TriangleAlert className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
      <span role="status">{status === "copied" ? "Copiado" : status === "error" ? "Reintentar" : "Copiar"}</span>
    </button>
  );
}
