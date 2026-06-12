"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageCircle, ArrowRight, Users, Zap, Shield, Globe, Send } from 'lucide-react';

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      number: "01",
      title: "Initialize Node",
      desc: "Sign up in milliseconds. Invite your neural team with a single encrypted link.",
      icon: <Users className="w-8 h-8" />,
      color: "violet"
    },
    {
      number: "02",
      title: "Establish Sync",
      desc: "Real-time connection via quantum WebSockets. See who's active immediately.",
      icon: <Zap className="w-8 h-8" />,
      color: "fuchsia"
    },
    {
      number: "03",
      title: "Structure Grid",
      desc: "Create channels, threads, and direct lines. Keep dimensions perfectly organized.",
      icon: <MessageCircle className="w-8 h-8" />,
      color: "cyan"
    },
    {
      number: "04",
      title: "Secure Payload",
      desc: "End-to-end encryption ensures your data streams stay private.",
      icon: <Shield className="w-8 h-8" />,
      color: "emerald"
    },
  ];

  return (
    <div className="min-h-screen bg-transparent text-white font-mono pt-32 overflow-hidden">
      {/* Hero */}
      <section className="pb-20 px-6 relative">
        <div className="absolute inset-0 bg-[radial-gradient(at_50%_0%,#c026d330_0%,transparent_50%)]" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex px-6 py-2 border border-fuchsia-400/30 bg-fuchsia-400/5 rounded-full mb-8 text-xs tracking-[4px] text-fuchsia-300"
          >
            OPERATION MANUAL
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-[90px] font-bold tracking-[-4px] leading-[1] mb-8 bg-gradient-to-br from-white via-fuchsia-200 to-cyan-300 bg-clip-text text-transparent"
          >
            HOW IT WORKS
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl text-zinc-400 max-w-2xl mx-auto font-light tracking-[-0.5px]"
          >
            Deploying a node takes less than 60 seconds. Learn the protocol.
          </motion.p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-12 gap-16 items-center">
            {/* Steps List */}
            <div className="md:col-span-5 space-y-6">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setActiveStep(index)}
                  className={`group p-8 rounded-3xl border transition-all cursor-pointer backdrop-blur-xl bg-zinc-950/60 ${
                    activeStep === index
                      ? 'border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.2)]'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-start gap-6">
                    <div className={`text-4xl font-bold tracking-tighter transition-colors ${activeStep === index ? 'text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-400' : 'text-zinc-600 group-hover:text-zinc-400'}`}>
                      {step.number}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <div className={`text-${step.color}-400 group-hover:scale-110 transition-transform ${activeStep === index ? 'scale-110' : ''}`}>{step.icon}</div>
                        <h3 className="text-2xl font-bold tracking-tight">{step.title}</h3>
                      </div>
                      <p className="text-zinc-400 font-light leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Live Preview / Interactive Area */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="md:col-span-7"
            >
              <div className="sticky top-32">
                <div className="bg-zinc-950/80 backdrop-blur-3xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(34,211,238,0.1)]">
                  <div className="bg-zinc-900/50 px-6 py-4 border-b border-white/10 flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
                    <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                    <div className="ml-4 text-xs tracking-[2px] uppercase text-zinc-500 font-bold">Terminal View • Node Active</div>
                  </div>

                  <div className="h-[520px] p-8 flex flex-col relative overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

                    {activeStep === 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="flex-1 flex items-center justify-center text-center relative z-10"
                      >
                        <div>
                          <div className="text-8xl mb-6">🚀</div>
                          <h3 className="text-3xl font-bold tracking-tight mb-4">Node Initialized!</h3>
                          <p className="text-zinc-400 max-w-xs mx-auto font-light">Your isolated workspace is ready. Invite additional minds.</p>
                        </div>
                      </motion.div>
                    )}

                    {activeStep === 1 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="flex-1 flex flex-col justify-center items-center relative z-10"
                      >
                        <div className="text-cyan-400 text-6xl mb-8 animate-[pulse_1s_ease-in-out_infinite]">⚡</div>
                        <h3 className="text-3xl font-bold tracking-tight mb-3">Quantum Sync Active</h3>
                        <p className="text-zinc-400 font-light">Latency {"<"} 1ms</p>
                      </motion.div>
                    )}

                    {activeStep === 2 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="flex-1 space-y-6 relative z-10"
                      >
                        <div className="bg-zinc-900/80 p-4 rounded-2xl border border-white/5 shadow-lg">💬 #general-comms</div>
                        <div className="bg-zinc-900/80 p-4 rounded-2xl border border-white/5 shadow-lg">🚀 #product-launch-3026</div>
                        <div className="bg-cyan-500/10 p-4 rounded-2xl border border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.1)]">↪ Active Thread: Deployment Status</div>
                      </motion.div>
                    )}

                    {activeStep === 3 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="flex-1 flex flex-col justify-center items-center text-center relative z-10"
                      >
                        <div className="text-6xl mb-8">🔐</div>
                        <h3 className="text-3xl font-bold tracking-tight mb-3">Payload Encrypted</h3>
                        <p className="text-emerald-400 tracking-[1px] uppercase text-sm font-semibold">Zero-Knowledge Architecture Confirmed</p>
                      </motion.div>
                    )}

                    <div className="mt-auto pt-8 border-t border-white/10 relative z-10">
                      <button 
                        onClick={() => setActiveStep((prev) => (prev + 1) % steps.length)}
                        className="w-full py-5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl font-bold tracking-[2px] uppercase text-black flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all"
                      >
                        Advance Protocol <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-32 border-y border-white/10 relative bg-zinc-950/50 backdrop-blur-3xl">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold tracking-tight">Why architects prefer Pulse</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "⚡", title: "Speed of Light", desc: "Under 1ms message delivery" },
              { icon: "🔒", title: "Military Grade", desc: "End-to-end encryption by default" },
              { icon: "🌍", title: "Omni-Dimensional", desc: "Works on all known devices" },
            ].map((benefit, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -10 }}
                className="bg-zinc-900/60 border border-white/10 rounded-3xl p-10 text-center hover:border-cyan-400/50 transition-all shadow-lg backdrop-blur-xl group"
              >
                <div className="text-6xl mb-8 group-hover:scale-110 transition-transform">{benefit.icon}</div>
                <h3 className="text-2xl font-bold tracking-tight mb-4">{benefit.title}</h3>
                <p className="text-zinc-400 font-light">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <div className="bg-gradient-to-br from-fuchsia-900/50 via-cyan-900/50 to-blue-900/50 py-32 relative overflow-hidden mt-20">
        <div className="absolute inset-0 bg-[radial-gradient(white_1px,transparent_1px)] bg-[length:40px_40px] opacity-5" />
        <div className="max-w-4xl mx-auto text-center px-6 relative z-10">
          <h2 className="text-5xl font-bold tracking-tighter mb-8">Ready to sync?</h2>
          <p className="text-xl text-zinc-300 font-light mb-12">Join thousands of nodes already active on the grid.</p>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              href="/register"
              className="inline-flex items-center gap-4 px-12 py-6 bg-white text-black rounded-3xl text-xl font-bold tracking-[1px] uppercase hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all"
            >
              CREATE WORKSPACE
              <ArrowRight className="w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}