"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { forwardRef } from "react";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-600/40 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-pine-700 text-white shadow-sm hover:bg-pine-600 hover:shadow-md active:scale-[0.98]",
        secondary:
          "border border-pine-100 bg-pine-50 text-pine-700 hover:bg-pine-100 active:scale-[0.98]",
        outline:
          "border border-line bg-ivory-50 text-inkbody hover:border-pine-100 hover:bg-pine-50 hover:text-pine-700 active:scale-[0.98]",
        ghost: "text-inkmuted hover:bg-ivory-200 hover:text-pine-700",
        gold: "bg-sand-500 text-white hover:bg-sand-600 active:scale-[0.98]",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-5 text-sm",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";
