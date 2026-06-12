"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function Terms() {
  return (
    <div className="min-h-screen bg-transparent text-white font-mono pt-32 pb-20 px-6 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="inline-flex px-6 py-2 border border-zinc-700 bg-zinc-900 rounded-full mb-6 text-xs tracking-[4px] text-zinc-400">
            DOCUMENT ID: TRM-3026
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent">
            TERMS OF SERVICE
          </h1>
          <p className="text-zinc-500 tracking-[1px] text-sm uppercase">Last updated: June 12, 3026</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-zinc-950/80 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 md:p-12 prose prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-cyan-400 prose-p:font-light prose-p:text-zinc-400 leading-relaxed"
        >
          <h2>1. System Access Protocol</h2>
          <p>
            By accessing the Pulse neural grid, you agree to be bound by these terms. We grant you a limited, non-exclusive, non-transferable license to access our dimensions for internal organizational purposes.
          </p>

          <h2>2. Quantum Encryption & Keys</h2>
          <p>
            Pulse utilizes zero-knowledge end-to-end encryption. You are solely responsible for maintaining the confidentiality of your Decryption Key. We cannot recover lost keys or decrypt your neural transmissions under any circumstances.
          </p>

          <h2>3. Acceptable Use</h2>
          <p>
            You agree not to use the Pulse grid to:
          </p>
          <ul>
            <li>Transmit malicious code, paradox-inducing algorithms, or unauthorized dimensional breaches.</li>
            <li>Harass, abuse, or harm other neural nodes.</li>
            <li>Interfere with or disrupt the integrity or performance of the network.</li>
          </ul>

          <h2>4. Service Level & Uptime</h2>
          <p>
            While we strive for 99.99% uptime, the grid is subject to dimensional fluctuations. We are not liable for any data loss, message latency, or temporary loss of access unless covered by a specific Omniverse SLA.
          </p>

          <h2>5. Termination of Link</h2>
          <p>
            We may suspend or terminate your node access if we determine you have violated these terms. You may terminate your account at any time by executing the self-destruct sequence in your Node Settings.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
