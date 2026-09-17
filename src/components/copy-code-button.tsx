import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyCodeButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(value.trim());
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button className="copy-button" type="button" onClick={copy} aria-label="Copiar comando">
      {copied ? <Check className="size-4 text-mint" /> : <Copy className="size-4" />}
      {copied ? "Copiado" : "Copiar"}
    </button>
  );
}
