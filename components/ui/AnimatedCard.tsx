'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Shared scroll-reveal + hover-lift card wrapper used across the homepage
 * and subject hub pages, built on the theme tokens from globals.css so it
 * reads correctly in both light and dark.
 */
export default function AnimatedCard({ children, className, delay = 0 }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      className={cn(
        'rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30',
        className
      )}
    >
      {children}
    </motion.div>
  );
}
