"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function Changelog() {
  const updates = [
    {
      version: "v3.0.26",
      date: "June 12, 3026",
      title: "Quantum Sync Architecture Override",
      changes: [
        "Upgraded core WebSocket connections to quantum state routers, reducing latency below 1ms.",
        "Introduced Holographic Profile views for enterprise nodes.",
        "Resolved anomaly where messages from alternative timelines would appear unread."
      ],
      type: "MAJOR"
    },
    {
      version: "v3.0.25",
      date: "May 28, 3026",
      title: "Neural Encryption Enhancement",
      changes: [
        "Added zero-knowledge padding to prevent metadata analysis by rogue AI factions.",
        "New dimensional gradient themes added to user preferences.",
        "Fixed a UI glitch in the transmission logs panel."
      ],
      type: "MINOR"
    },
    {
      version: "v3.0.24",
      date: "May 10, 3026",
      title: "Grid Stability Patch",
      changes: [
        "Optimized client-side memory allocation for users active in >1000 channels.",
        "Deprecated legacy HTTP fallback protocols."
      ],
      type: "PATCH"
    }
  ];

  return (
    <div className="min-h-screen bg-transparent text-white font-mono pt-32 pb-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(at_50%_0%,#f59e0b30_0%,transparent_50%)] z-0 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20 text-center"
        >
          <div className="inline-flex px-6 py-2 border border-amber-400/30 bg-amber-400/5 rounded-full mb-8 text-xs tracking-[4px] text-amber-300">
            SYSTEM UPDATES
          </div>
          <h1 className="text-6xl md:text-[80px] font-bold tracking-tighter mb-6 bg-gradient-to-br from-white via-amber-200 to-orange-400 bg-clip-text text-transparent">
            CHANGELOG
          </h1>
          <p className="text-zinc-400 text-xl font-light tracking-[-0.5px]">Evolution of the Pulse Grid.</p>
        </motion.div>

        <div className="space-y-16">
          {updates.map((update, i) => (
            <motion.div 
              key={update.version}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.2 }}
              className="relative pl-8 md:pl-0"
            >
              <div className="hidden md:block absolute left-[160px] top-0 bottom-[-64px] w-px bg-white/10" />
              <div className="hidden md:block absolute left-[156px] top-2 w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.8)]" />

              <div className="md:grid md:grid-cols-[130px_1fr] md:gap-16 items-start">
                <div className="mb-4 md:mb-0 md:text-right">
                  <div className="text-xs font-bold tracking-[2px] text-amber-400 mb-1">{update.version}</div>
                  <div className="text-xs text-zinc-500 uppercase tracking-[1px]">{update.date}</div>
                </div>

                <div className="bg-zinc-950/80 backdrop-blur-xl border border-white/10 hover:border-amber-400/40 rounded-3xl p-8 transition-all hover:shadow-[0_0_30px_rgba(245,158,11,0.1)]">
                  <div className="flex items-center gap-3 mb-6">
                    <span className={`text-[10px] font-bold tracking-[2px] uppercase px-3 py-1 rounded-full border ${
                      update.type === 'MAJOR' ? 'border-amber-400 text-amber-400 bg-amber-400/10' : 
                      update.type === 'MINOR' ? 'border-blue-400 text-blue-400 bg-blue-400/10' : 
                      'border-zinc-500 text-zinc-400 bg-zinc-800'
                    }`}>
                      {update.type}
                    </span>
                    <h2 className="text-2xl font-bold tracking-tight">{update.title}</h2>
                  </div>

                  <ul className="space-y-4">
                    {update.changes.map((change, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-zinc-400 font-light">
                        <span className="text-amber-400 mt-1">▹</span>
                        <span className="leading-relaxed">{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}