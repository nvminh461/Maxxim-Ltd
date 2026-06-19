"use client";

import { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

// Custom cubic bezier easing for premium luxury vibe (easeOutQuart-like)
const luxuryEaseOut = [0.16, 1, 0.3, 1] as const;

export const zoomInVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 50,
  },
  visible: (custom: { duration?: number; delay?: number } = {}) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: custom.duration ?? 0.65,
      delay: custom.delay ?? 0,
      ease: luxuryEaseOut,
    },
  }),
};

export const staggerContainerVariants = {
  hidden: {},
  visible: (custom: { staggerDelay?: number } = {}) => ({
    transition: {
      staggerChildren: custom.staggerDelay ?? 0.1,
    },
  }),
};

interface ScrollRevealProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  duration?: number;
  delay?: number;
  once?: boolean;
  margin?: string;
}

export function ScrollReveal({
  children,
  duration = 0.7,
  delay = 0,
  once = false,
  margin = "-80px",
  ...props
}: ScrollRevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin }}
      variants={zoomInVariants}
      custom={{ duration, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface ScrollRevealContainerProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  staggerDelay?: number;
  once?: boolean;
  margin?: string;
}

export function ScrollRevealContainer({
  children,
  staggerDelay = 0.1,
  once = false,
  margin = "-80px",
  ...props
}: ScrollRevealContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin }}
      variants={staggerContainerVariants}
      custom={{ staggerDelay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function ScrollRevealItem(props: HTMLMotionProps<"div">) {
  return (
    <motion.div
      variants={zoomInVariants}
      {...props}
    />
  );
}
