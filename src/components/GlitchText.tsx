'use client';

import React from 'react';

interface GlitchTextProps {
  text: string;
  highlightedWord?: string;
}

export default function GlitchText({ text, highlightedWord }: GlitchTextProps) {
  // If we want to highlight a word, we need to split the text
  const parts = highlightedWord ? text.split(new RegExp(`(${highlightedWord})`, 'gi')) : [text];

  return (
    <div className="relative inline-block w-full overflow-visible">
      <h1 
        className="glitch-text text-[4.2vw] sm:text-[5vw] md:text-5xl lg:text-6xl font-heading font-black text-white uppercase relative inline-block z-10 whitespace-nowrap leading-none"
        data-text={text}
      >
        {parts.map((part, i) => 
          part.toLowerCase() === highlightedWord?.toLowerCase() ? (
            <span key={i} className="text-maac-gold">{part}</span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </h1>
    </div>
  );
}
