"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ReactNode, useRef } from "react";

/**
 * Subtle scroll-linked vertical drift for a photograph. Disabled entirely
 * when the user prefers reduced motion.
 */
export function ScrollDrift({
  children,
  className,
  distance = 40,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  return (
    <motion.div ref={ref} style={prefersReducedMotion ? undefined : { y }} className={className}>
      {children}
    </motion.div>
  );
}

/**
 * A vertical line that "draws" as the visitor scrolls through a section,
 * reinforcing progression. Rendered fully drawn under reduced motion.
 */
export function ScrollLine({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });

  return (
    <div ref={ref} aria-hidden="true" className={className}>
      <div className="absolute inset-0 bg-foreground/10" />
      <motion.div
        className="absolute inset-0 origin-top bg-golden"
        style={prefersReducedMotion ? undefined : { scaleY: scrollYProgress }}
      />
    </div>
  );
}


interface MotionProps {
  children?: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
}

export function FadeIn({ children, className, delay = 0, direction = "up" }: MotionProps) {
  const prefersReducedMotion = useReducedMotion();

  const directionOffset = {
    up: 40,
    down: -40,
    left: 40,
    right: -40,
    none: 0,
  };

  const initialY = direction === "up" || direction === "down" ? directionOffset[direction] : 0;
  const initialX = direction === "left" || direction === "right" ? directionOffset[direction] : 0;

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        y: prefersReducedMotion ? 0 : initialY, 
        x: prefersReducedMotion ? 0 : initialX 
      }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.8, 
        delay, 
        ease: [0.21, 0.47, 0.32, 0.98] // OutExpo-ish curve for elegant entrance
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ children, className, delayChildren = 0.1, staggerChildren = 0.15 }: { children: ReactNode, className?: string, delayChildren?: number, staggerChildren?: number }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: prefersReducedMotion ? 0 : staggerChildren,
            delayChildren,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  direction = "up",
  as = "div",
}: MotionProps & { as?: "div" | "li" }) {
  const prefersReducedMotion = useReducedMotion();
  
  const directionOffset = {
    up: 30,
    down: -30,
    left: 30,
    right: -30,
    none: 0,
  };

  const initialY = direction === "up" || direction === "down" ? directionOffset[direction] : 0;
  const initialX = direction === "left" || direction === "right" ? directionOffset[direction] : 0;

  const Component = as === "li" ? motion.li : motion.div;

  return (
    <Component
      variants={{
        hidden: { 
          opacity: 0, 
          y: prefersReducedMotion ? 0 : initialY,
          x: prefersReducedMotion ? 0 : initialX 
        },
        visible: { 
          opacity: 1, 
          y: 0, 
          x: 0,
          transition: { duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }
        },
      }}
      className={className}
    >
      {children}
    </Component>
  );
}

export function ParallaxImage({ 
  children, 
  className 
}: { 
  children: ReactNode;
  className?: string;
}) {
  // Simple hover scale effect for images that respects reduced motion
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div
      whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
      transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
