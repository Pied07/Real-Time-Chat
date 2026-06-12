"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: "How does the Quantum Encryption work?",
    answer: "Every message sent on Pulse uses military-grade, end-to-end encryption. Keys are generated client-side and never touch our servers. We use a combination of AES-256-GCM and neural-synced key exchange to ensure perfect forward secrecy."
  },
  {
    question: "Can I self-host Pulse?",
    answer: "Currently, self-hosting is only available on our Omniverse Enterprise plan. Our cloud grid provides 99.99% uptime and zero-maintenance architecture, which is sufficient for 99% of our users."
  },
  {
    question: "Is Pulse actually faster than alternatives?",
    answer: "Yes. By utilizing raw WebSockets and edge-optimized datacenters (the 'Grid'), our latency is typically under 50ms globally. We've stripped out legacy protocols to ensure true real-time syncing."
  },
  {
    question: "What happens if I lose my Decryption Key?",
    answer: "If you lose your password/decryption key, you cannot recover your past encrypted messages. This is the nature of true zero-knowledge end-to-end encryption. However, you can reset your key to continue using the account for new messages."
  },
  {
    question: "Are there limits on file uploads?",
    answer: "Basic Nodes get 10GB of secure storage. Quantum Grid users get 1TB per node. Omniverse clusters have unlimited scalable storage."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-transparent text-white font-mono pt-32 overflow-hidden">
      <section className="pb-20 px-6 relative">
        <div className="absolute inset-0 bg-[radial-gradient(at_50%_0%,#10b98130_0%,transparent_50%)]" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex px-6 py-2 border border-emerald-400/30 bg-emerald-400/5 rounded-full mb-8 text-xs tracking-[4px] text-emerald-300"
          >
            KNOWLEDGE BASE
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-[80px] font-bold tracking-[-4px] leading-[1] mb-8 bg-gradient-to-br from-white via-emerald-200 to-cyan-300 bg-clip-text text-transparent"
          >
            FAQ
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-zinc-400 max-w-2xl mx-auto font-light tracking-[-0.5px]"
          >
            Frequently accessed queries from the neural collective.
          </motion.p>
        </div>
      </section>

      <section className="py-12 relative z-10 px-6">
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="mb-6"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between bg-zinc-900/60 backdrop-blur-md border border-white/10 hover:border-emerald-400/50 p-6 rounded-2xl transition-all text-left group"
              >
                <span className="text-xl font-bold tracking-tight group-hover:text-emerald-300 transition-colors">
                  {faq.question}
                </span>
                <span className="text-zinc-500 group-hover:text-emerald-400 transition-colors ml-4 shrink-0">
                  {openIndex === index ? <Minus /> : <Plus />}
                </span>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 text-zinc-400 font-light leading-relaxed border-x border-b border-emerald-400/20 bg-emerald-400/5 rounded-b-2xl -mt-2 pt-6">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
