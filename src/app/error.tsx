'use client';

import { useEffect } from 'react';
import { RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('SERVER_CRASH_LOG:', {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
    });
  }, [error]);

  return (
    <div className="min-h-screen bg-obsidian-black flex items-center justify-center p-6 text-center">
      <div className="max-w-xl space-y-8">
        <div className="space-y-4">
          <h1 className="text-maac-gold font-heading text-6xl md:text-8xl uppercase tracking-tighter">System Error</h1>
          <p className="text-white/40 font-sans text-lg md:text-xl leading-relaxed">
            A critical module failure occurred. This is usually due to a server-side dependency conflict.
          </p>
          {error.digest && (
            <div className="bg-white/5 p-4 rounded border border-white/10 font-mono text-[10px] text-maac-gold/50">
              Error ID: {error.digest}
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="w-full md:w-auto bg-maac-gold text-obsidian-black px-8 py-4 font-heading uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-white transition-all"
          >
            <RotateCcw size={16} /> Try Again
          </button>
          <Link
            href="/"
            className="w-full md:w-auto bg-deep-navy text-white px-8 py-4 font-heading uppercase tracking-widest text-xs flex items-center justify-center gap-2 border border-white/10 hover:border-maac-gold transition-all"
          >
            <Home size={16} /> Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
