"use client";

import React from "react";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Zap, Shield, Users, Clock, 
  HelpCircle, Users2, Gift, 
  FileText, Scale, Lock, Award, ArrowRight 
} from "lucide-react";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-transparent text-white font-mono pt-32 overflow-hidden">

      <section className="pb-20 px-6 relative">
        <div className="absolute inset-0 bg-[radial-gradient(at_50%_0%,#a855f730_0%,transparent_50%)]" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex px-6 py-2 border border-violet-400/30 bg-violet-400/5 rounded-full mb-8 text-xs tracking-[4px] text-violet-300"
          >
            NEURAL MODULES
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-[90px] font-bold tracking-[-4px] leading-[1] mb-8 bg-gradient-to-br from-white via-violet-200 to-cyan-300 bg-clip-text text-transparent"
          >
            SYSTEM FEATURES
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl text-zinc-400 max-w-2xl mx-auto font-light tracking-[-0.5px]"
          >
            Everything your dimensional team needs to stay connected, aligned, and synchronized.
          </motion.p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-10 h-10 text-cyan-400" />,
                title: "Quantum Sync",
                desc: "Messages delivered in under 1ms with optimized neural connections. Real-time presence."
              },
              {
                icon: <Shield className="w-10 h-10 text-emerald-400" />,
                title: "Neural Encryption",
                desc: "Your conversations are private by default. Zero-knowledge architecture guarantees safety."
              },
              {
                icon: <Users className="w-10 h-10 text-fuchsia-400" />,
                title: "Dimensional Threads",
                desc: "Organized streams with threaded replies, powerful permissions, and role-based access."
              },
              {
                icon: <Clock className="w-10 h-10 text-amber-400" />,
                title: "Omnipresence",
                desc: "See who's active in the grid. Get notified when someone enters your dimension."
              },
              {
                icon: <Users2 className="w-10 h-10 text-violet-400" />,
                title: "Mass Nodes",
                desc: "Unlimited members, massive file sharing, holograms, reactions, and rich embeds."
              },
              {
                icon: <Gift className="w-10 h-10 text-rose-400" />,
                title: "Grid APIs",
                desc: "Connect with all legacy and future tools. Build custom bots to automate your sector."
              }
            ].map((feature, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-zinc-950/60 backdrop-blur-xl border border-white/10 rounded-3xl p-10 hover:border-cyan-400/50 group transition-all relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="mb-8 p-4 bg-white/5 inline-flex rounded-2xl group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.05)] group-hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold tracking-tight mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-cyan-400 transition-all">{feature.title}</h3>
                <p className="text-zinc-400 font-light leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="bg-gradient-to-br from-violet-900/50 via-fuchsia-900/50 to-cyan-900/50 py-32 border-t border-white/10 mt-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(white_1px,transparent_1px)] bg-[length:40px_40px] opacity-5" />
        <div className="max-w-4xl mx-auto text-center px-6 relative z-10">
          <h2 className="text-5xl font-bold tracking-tighter mb-8">Ready to upgrade your modules?</h2>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/register" className="inline-flex px-12 py-6 bg-white text-black text-xl font-bold tracking-[1px] uppercase rounded-3xl hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all items-center gap-4">
              INITIALIZE NOW
              <ArrowRight className="w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}