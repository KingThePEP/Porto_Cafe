import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a24931] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-[#a24931] text-white shadow-[0_12px_28px_rgba(201,103,75,0.22)] hover:-translate-y-0.5 hover:bg-[#8f3d26]",
        secondary:
          "border border-[#d8c9b8] bg-white/70 text-[#30251f] hover:-translate-y-0.5 hover:border-[#a24931] hover:bg-white",
        ghost: "text-[#6d5b50] hover:bg-[#f0e6db] hover:text-[#30251f]",
        dark: "bg-[#241c18] text-white hover:-translate-y-0.5 hover:bg-[#3a2b23]",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4 text-xs",
        lg: "h-14 px-7 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export { Button, buttonVariants };
