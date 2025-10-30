import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export const MovingBorder = ({
  children,
  duration = 2000,
  className,
  containerClassName,
  borderClassName,
  as: Component = "button",
  ...otherProps
}: {
  children: React.ReactNode;
  duration?: number;
  className?: string;
  containerClassName?: string;
  borderClassName?: string;
  as?: any;
  [key: string]: any;
}) => {
  return (
    <Component
      className={cn(
        "relative text-xl p-px overflow-hidden",
        containerClassName
      )}
      {...otherProps}
    >
      <div
        className="absolute inset-0"
        style={{ padding: "1px" }}
      >
        <motion.div
          className={cn(
            "absolute inset-0 rounded-lg opacity-75",
            borderClassName
          )}
          style={{
            background:
              "linear-gradient(90deg, #a855f7, #ec4899, #f59e0b, #10b981, #3b82f6, #a855f7)",
            backgroundSize: "400% 400%",
          }}
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: duration / 1000,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
      <div
        className={cn(
          "relative bg-slate-900/90 backdrop-blur-xl rounded-lg z-10",
          className
        )}
      >
        {children}
      </div>
    </Component>
  );
};
