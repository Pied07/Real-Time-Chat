"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Terminal, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-transparent text-white font-mono flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#ef444420_0%,transparent_50%)] z-0 pointer-events-none" />

      <div className="max-w-2xl text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-center mb-8"
        >
          <div className="w-24 h-24 bg-red-500/10 border border-red-500/30 rounded-3xl flex items-center justify-center text-red-500 animate-pulse">
            <Terminal className="w-12 h-12" />
          </div>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-8xl md:text-[120px] font-bold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-red-500"
        >
          404
        </motion.h1>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-bold tracking-[2px] uppercase text-zinc-300 mb-6"
        >
          Transmission Lost
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-zinc-500 font-light text-lg mb-12 max-w-md mx-auto"
        >
          The coordinate you are trying to reach does not exist in this dimension. 
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Link 
            href="/"
            className="inline-flex items-center gap-3 px-8 py-4 bg-zinc-900 border border-white/10 hover:border-cyan-400 rounded-full font-bold tracking-[2px] uppercase text-white hover:text-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            RETURN TO GRID
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
