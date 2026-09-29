import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "../../lib/utils";

export const Sheet = Dialog.Root;
export const SheetTrigger = Dialog.Trigger;

export function SheetContent({ className, children, ...props }: ComponentProps<typeof Dialog.Content>) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-40 bg-ink/80 backdrop-blur-sm" />
      <Dialog.Content
        className={cn("fixed inset-y-0 left-0 z-50 w-[min(22rem,88vw)] border-r border-white/10 bg-[#0d1427] p-6 shadow-2xl focus:outline-none", className)}
        {...props}
      >
        {children}
        <Dialog.Close className="absolute right-4 top-4 rounded-xs border border-white/15 bg-white/5 p-2 text-slate-300 transition duration-200 motion-safe:hover:-translate-y-0.5 hover:border-mint/70 hover:bg-mint/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint">
          <X className="size-5" />
          <span className="sr-only">Cerrar menú</span>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
