
"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "lg";
  className?: string;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const base = "inline-flex items-center justify-center rounded-2xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    const variants: Record<string, string> = {
      default: "bg-emerald-600 text-white hover:bg-emerald-700",
      outline: "border border-emerald-600 text-emerald-700 hover:bg-emerald-50",
      secondary: "bg-white text-emerald-900 hover:bg-emerald-50",
    };
    const sizes: Record<string, string> = {
      default: "h-10 px-4 py-2",
      lg: "h-12 px-6 text-base",
    };
    const cls = [base, variants[variant], sizes[size], className].filter(Boolean).join(" ");
    return <Comp className={cls} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";
