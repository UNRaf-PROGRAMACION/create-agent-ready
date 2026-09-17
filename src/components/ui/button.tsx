import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost";
};

export function Button({ className, variant = "default", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint disabled:pointer-events-none disabled:opacity-50",
        variant === "default" && "bg-mint text-ink hover:bg-mint/85",
        variant === "outline" && "border border-white/15 bg-white/5 text-white hover:border-mint/70 hover:bg-mint/10",
        variant === "ghost" && "text-slate-300 hover:bg-white/8 hover:text-white",
        className,
      )}
      {...props}
    />
  );
}
