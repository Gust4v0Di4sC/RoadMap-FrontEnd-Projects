import * as React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const appButtonVariants = cva(buttonVariants().base, {
  variants: {
    intent: {
      primary: "bg-primary text-primary-foreground hover:opacity-95",
      ghost: "bg-transparent hover:bg-muted",
      danger: "bg-red-600 text-white hover:bg-red-700",
    },
  },
  defaultVariants: {
    intent: "primary",
  },
});

type Props = React.ComponentProps<typeof Button> &
  VariantProps<typeof appButtonVariants> & {
    intent?: "primary" | "ghost" | "danger";
  };

export function AppButton({ className, intent, ...props }: Props) {
  return <Button className={cn(appButtonVariants({ intent }), className)} {...props} />;
}
