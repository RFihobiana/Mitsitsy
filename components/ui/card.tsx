import * as React from "react";
import { cn } from "@/lib/utils";

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export const Card = ({ className, ...props }: DivProps) => (
  <div className={cn("rounded-lg border bg-card text-foreground shadow-sm", className)} {...props} />
);
export const CardHeader = ({ className, ...props }: DivProps) => (
  <div className={cn("flex flex-col gap-1.5 p-5 pb-3", className)} {...props} />
);
export const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2 className={cn("text-base font-semibold tracking-tight", className)} {...props} />
);
export const CardContent = ({ className, ...props }: DivProps) => (
  <div className={cn("p-5 pt-2", className)} {...props} />
);
