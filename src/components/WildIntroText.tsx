'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface WildIntroTextProps {
  text: string;
  highlightedWord?: string;
}

export default function WildIntroText({ text, highlightedWord }: WildIntroTextProps) {
  // Split text into words
  const words = text.split(' ');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.2,
      },
    },
  };

  const childVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      skewX: 0 
    },
    visible: {
      opacity: [0, 1, 0.5, 1],
      y: [0, -25, 20, -10, 0],
      skewX: [0, 20, -20, 10, 0],
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="flex flex-nowrap items-center justify-start gap-x-[0.2em] overflow-visible py-4 whitespace-nowrap"
    >
      {words.map((word, wordIdx) => {
        // Check if this word is part of the highlighted phrase
        const isHighlighted = highlightedWord && highlightedWord.toLowerCase().includes(word.toLowerCase());
        const chars = Array.from(word);

        return (
          <span key={wordIdx} className="inline-flex overflow-visible">
            {chars.map((char, charIdx) => (
              <motion.span
                key={charIdx}
                variants={childVariants}
                className={`inline-block font-heading font-black text-[5vw] md:text-5xl lg:text-6xl uppercase relative ${isHighlighted ? 'text-[#FFB703]' : 'text-white'}`}
              >
                <motion.span
                  animate={{ 
                    y: [0, -1, 1, 0],
                    filter: ["blur(0px)", "blur(0.5px)", "blur(0px)"]
                  }}
                  transition={{
                    duration: 0.2,
                    repeat: Infinity,
                    repeatDelay: Math.random() * 4 + 2
                  }}
                >
                  {char}
                </motion.span>
              </motion.span>
            ))}
          </span>
        );
      })}
    </motion.div>
  );
}
