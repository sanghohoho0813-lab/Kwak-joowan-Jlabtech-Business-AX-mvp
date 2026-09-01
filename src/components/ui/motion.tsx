"use client";

/**
 * 공통 등장 모션 — 과하지 않게, 부드러운 reveal + stagger 만 사용한다.
 */

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05, delayChildren: 0.03 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Stagger({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  /** 목차에서 이 섹션으로 이동할 때 쓰는 앵커 */
  id?: string;
}) {
  return (
    <motion.div
      id={id}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <motion.div id={id} className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}

export function Reveal({
  children,
  className,
  delay = 0,
  id,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** 목차에서 이 섹션으로 이동할 때 쓰는 앵커 */
  id?: string;
}) {
  return (
    <motion.div
      id={id}
      className={className}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.34, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
