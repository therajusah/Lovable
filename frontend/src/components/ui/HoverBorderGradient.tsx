import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export const HoverBorderGradient = ({
  children,
  containerClassName,
  className,
  as: Component = "button",
  duration = 1,
  ...props
}: {
  children: React.ReactNode;
  containerClassName?: string;
  className?: string;
  as?: React.ElementType;
  duration?: number;
} & React.HTMLAttributes<HTMLElement>) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Component
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative p-[2px] overflow-hidden rounded-lg transition-all duration-300",
        containerClassName
      )}
      {...props}
    >
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          background: hovered
            ? "linear-gradient(90deg, #a855f7, #ec4899, #f59e0b, #10b981, #3b82f6, #a855f7)"
            : "transparent",
          backgroundSize: "200% 200%",
        }}
        animate={
          hovered
            ? {
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }
            : {}
        }
        transition={{
          duration: duration * 2,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <div
        className={cn(
          "relative z-10 bg-background rounded-lg transition-colors duration-300",
          hovered ? "bg-background/90" : "bg-background",
          className
        )}
      >
        {children}
      </div>
    </Component>
  );
};
