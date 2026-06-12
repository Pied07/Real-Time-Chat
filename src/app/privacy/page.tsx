"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-transparent text-white font-mono pt-32 pb-20 px-6 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="inline-flex px-6 py-2 border border-zinc-700 bg-zinc-900 rounded-full mb-6 text-xs tracking-[4px] text-zinc-400">
            DOCUMENT ID: PRV-3026
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent">
            PRIVACY POLICY
          </h1>
          <p className="text-zinc-500 tracking-[1px] text-sm uppercase">Last updated: June 12, 3026</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-zinc-950/80 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 md:p-12 prose prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-cyan-400 prose-p:font-light prose-p:text-zinc-400 leading-relaxed"
        >
          <h2>1. Zero-Knowledge Promise</h2>
          <p>
            Pulse is built on a zero-knowledge architecture. We do not have the technical ability to read, decrypt, or analyze your messages, files, or neural streams. Your communications belong entirely to you.
          </p>

          <h2>2. Data We Collect</h2>
          <p>
            To provide the service, we only collect the absolute minimum required data:
          </p>
          <ul>
            <li><strong>Node Identity:</strong> Your email address and hashed authentication data.</li>
            <li><strong>Public Keys:</strong> Required for other nodes to initiate encrypted handshakes with you.</li>
            <li><strong>Metadata:</strong> Connection timestamps and network diagnostic telemetry to maintain grid stability.</li>
          </ul>

          <h2>3. Data Storage & Grid Infrastructure</h2>
          <p>
            Encrypted data is routed through our global edge network. Your encrypted payload is stored on decentralized nodes until delivered, at which point it is synchronized with your local hardware and removed from temporary relay caches.
          </p>

          <h2>4. Third-Party Access</h2>
          <p>
            We do not sell, rent, or trade your data. Due to our end-to-end encryption, we cannot comply with data requests for message content from any authority, as we simply do not possess the decryption keys.
          </p>

          <h2>5. Your Rights</h2>
          <p>
            You have the right to request deletion of your node from the grid at any time. Upon deletion, all associated metadata and public keys are permanently purged from the network.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
