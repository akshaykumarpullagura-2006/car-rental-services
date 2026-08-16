'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ScrollCardSectionProps {
  children: React.ReactNode;
  className?: string;
  bg?: string;
}

export const ScrollCardSection: React.FC<ScrollCardSectionProps> = ({
  children,
  className = '',
  bg = 'bg-white',
}) => {
  return (
    <motion.div
      initial={{ y: 65, opacity: 0.92 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className={`w-full ${bg} relative ${className}`}
    >
      {children}
    </motion.div>
  );
};
