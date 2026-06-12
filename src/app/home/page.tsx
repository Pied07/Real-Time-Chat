"use client";

import React, { useState, useEffect } from "react";
import {
  MessageCircle,
  Users,
  Shield,
  Zap,
  Star,
  ArrowRight,
  Play,
  CheckCircle,
} from "lucide-react";
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [showVideo, setShowVideo] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const [counters, setCounters] = useState({
    users: 0,
    messages: 0,
    teams: 0,
    uptime: 0,
  });

  // Enhanced Futuristic Counter Animation with Glitch Effect
  useEffect(() => {
    const animateCounters = () => {
      const targets = { users: 125000, messages: 45000000, teams: 8750, uptime: 99.99 };
      const duration = 2200;
      const steps = 120;
      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        const progress = Math.min(currentStep / steps, 1);
        
        setCounters({
          users: Math.floor(targets.users * (1 - Math.pow(1 - progress, 2.5))),
          messages: Math.floor(targets.messages * (1 - Math.pow(1 - progress, 2.5))),
          teams: Math.floor(targets.teams * (1 - Math.pow(1 - progress, 2.5))),
          uptime: Math.round(targets.uptime * progress * 100) / 100,
        });

        if (currentStep >= steps) {
          clearInterval(interval);
          setCounters(targets);
        }
      }, duration / steps);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animateCounters();
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    const counterSection = document.getElementById('stats');
    if (counterSection) observer.observe(counterSection);

    return () => observer.disconnect();
  }, []);

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Head of Product @ Vercel",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
      quote: "Pulse has completely transformed how our team communicates. The speed and presence features are unmatched.",
      company: "Vercel",
    },
    {
      name: "Marcus Rodriguez",
      role: "CTO @ Linear",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      quote: "The most reliable team chat we've ever used. Real-time feels truly real-time. Our engineering velocity went up 3x.",
      company: "Linear",
    },
    {
      name: "Priya Patel",
      role: "Design Director @ Notion",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      quote: "Finally a chat app that doesn't feel like Slack. Beautiful, fast, and actually delightful to use.",
      company: "Notion",
    },
  ];

  // Glitch animation for counters
  const glitchVariants = {
    hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { 
        delay: i * 0.1,
        duration: 0.8,
        ease: [0.23, 1, 0.32, 1]
      }
    }),
    glitch: {
      x: [0, -4, 4, -2, 2, 0],
      transition: { duration: 0.4, repeat: 1 }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden font-mono">
      {/* Enhanced Futuristic Background Grid + Particles */}
      <div className="fixed inset-0 bg-[radial-gradient(#ffffff10_0.8px,transparent_1px)] bg-[length:40px_40px] pointer-events-none z-[-1]" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:80px_80px] pointer-events-none z-[-1]" />

      {/* Hero Section - 3026 AD Style */}
      <section className="pt-32 pb-40 px-6 relative min-h-screen flex items-center">
        <div className="absolute inset-0 bg-[radial-gradient(at_50%_30%,#7c3aed40_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(at_70%_70%,#ec489940_0%,transparent_60%)]" />
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Holographic Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-8 py-3 bg-white/5 backdrop-blur-3xl border border-white/20 rounded-3xl mb-10 shadow-2xl shadow-cyan-500/20"
          >
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400" />
            </div>
            <span className="text-sm font-medium tracking-[4px] text-cyan-300">NEURAL • QUANTUM • 3026</span>
          </motion.div>

          <h1 className="text-7xl md:text-[110px] font-bold tracking-[-6px] leading-[0.9] mb-8 bg-gradient-to-br from-white via-cyan-200 to-violet-300 bg-clip-text text-transparent">
            CONVERSATION<br />REINVENTED
          </h1>

          <p className="text-2xl md:text-4xl text-zinc-400 max-w-4xl mx-auto mb-16 font-light tracking-[-0.5px]">
            In 3026, teams don&apos;t chat.<br />
            <span className="text-white">They sync minds at lightspeed.</span>
          </p>

          <div className="flex items-center justify-center gap-6 flex-wrap">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link 
                href="/register" 
                className="group relative px-12 py-6 bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 rounded-3xl font-semibold text-2xl flex items-center gap-4 overflow-hidden shadow-[0_0_60px_-10px] shadow-cyan-400"
              >
                <span className="relative z-10">ENTER THE GRID</span>
                <ArrowRight className="w-7 h-7 group-hover:rotate-45 transition-transform" />
                <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-all duration-500" />
              </Link>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowVideo(true)}
              className="group px-12 py-6 border border-white/40 hover:border-cyan-400 backdrop-blur-3xl rounded-3xl font-medium text-2xl flex items-center gap-4 transition-all hover:bg-white/10"
            >
              <Play className="w-7 h-7 group-hover:scale-110 transition-transform" />
              TRANSMISSION DEMO
            </motion.button>
          </div>

          <div className="mt-20 flex justify-center gap-16 text-sm uppercase tracking-[3px] text-zinc-500">
            <div className="flex items-center gap-3">
              <div className="w-px h-6 bg-gradient-to-b from-transparent via-cyan-400 to-transparent" />
              QUANTUM ENCRYPTED
            </div>
            <div>125K+ NEURAL NODES ACTIVE</div>
          </div>
        </div>

        {/* Holographic Orb */}
        <motion.div 
          animate={{ 
            rotate: 360,
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            rotate: { duration: 60, repeat: Infinity, ease: "linear" },
            scale: { duration: 8, repeat: Infinity }
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-gradient-to-br from-cyan-400/10 via-fuchsia-500/10 to-violet-500/10 rounded-full blur-[140px] -z-10 pointer-events-none"
        />
      </section>

      {/* Stats - 3026 Futuristic Holographic Counters */}
      <section id="stats" className="py-32 border-y border-white/10 bg-zinc-950/90 backdrop-blur-3xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#ffffff05_0,#ffffff05_2px,transparent_2px,transparent_40px)]" />
        
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline px-6 py-2 text-xs tracking-[4px] border border-cyan-400/30 bg-cyan-400/5 rounded-full">GLOBAL NEURAL METRICS • LIVE</div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "ACTIVE NEURAL NODES", value: counters.users, suffix: "+", color: "cyan" },
              { label: "QUANTUM MESSAGES", value: counters.messages, suffix: "+", color: "fuchsia" },
              { label: "SYNCHRONIZED TEAMS", value: counters.teams, suffix: "+", color: "violet" },
              { label: "HYPERSPACE UPTIME", value: counters.uptime, suffix: "%", color: "emerald" },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={glitchVariants}
                whileHover="glitch"
                className="group relative bg-zinc-900/70 border border-white/10 hover:border-cyan-400/50 rounded-3xl p-12 text-center overflow-hidden backdrop-blur-3xl"
              >
                {/* Scanning line */}
                <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent group-hover:animate-[scan_2s_linear_infinite]" />
                
                <div className={`text-7xl md:text-8xl font-bold tracking-[-4px] mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-${stat.color}-400 drop-shadow-[0_0_30px_rgb(103,232,249)]`}>
                  {stat.value.toLocaleString()}{stat.suffix}
                </div>
                
                <div className="text-xs uppercase tracking-[4px] text-zinc-500 font-medium">{stat.label}</div>
                
                {/* Corner accents */}
                <div className="absolute top-6 right-6 w-4 h-4 border-t-2 border-r-2 border-cyan-400/40" />
                <div className="absolute bottom-6 left-6 w-4 h-4 border-b-2 border-l-2 border-cyan-400/40" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features - Holographic Cards */}
      <section className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-7xl font-bold tracking-tighter mb-4 bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent"
            >
              NEURAL ARCHITECTURE
            </motion.h2>
            <p className="text-3xl text-zinc-400">Built for minds that move faster than light</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "INSTANT QUANTUM SYNC", desc: "Messages arrive before you think them. Presence is omniscient.", color: "cyan" },
              { icon: Shield, title: "NEURAL ENCRYPTION", desc: "Your thoughts are protected by military-grade quantum shielding.", color: "emerald" },
              { icon: Users, title: "COLLECTIVE INTELLIGENCE", desc: "AI-augmented teams that anticipate needs before they arise.", color: "violet" },
              { icon: Star, title: "DIMENSIONALLY BEAUTIFUL", desc: "Interfaces that feel alive. Every pixel pulses with purpose.", color: "fuchsia" },
              { icon: CheckCircle, title: "OMNIVERSE INTEGRATIONS", desc: "Seamless connection across all known productivity dimensions.", color: "amber" },
              { icon: MessageCircle, title: "EVERYWHERE • EVERYWHEN", desc: "Native presence on every device in every timeline.", color: "rose" },
            ].map((f, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -12, scale: 1.02 }}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative bg-gradient-to-br from-zinc-950 to-black border border-white/10 hover:border-white/30 rounded-3xl p-12 transition-all duration-700 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-${f.color}-500/10 to-${f.color}-600/10 flex items-center justify-center mb-10 group-hover:rotate-12 transition-transform`}>
                  <f.icon className={`w-11 h-11 text-${f.color}-400`} />
                </div>
                
                <h3 className="text-4xl font-semibold mb-6 tracking-tight">{f.title}</h3>
                <p className="text-zinc-400 leading-relaxed text-lg">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Futuristic Carousel */}
      <section className="py-32 px-6 bg-black/95 relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-7xl font-bold tracking-tighter">ECHOES FROM THE GRID</h2>
          </div>

          <div className="relative min-h-[520px] flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTestimonial}
                initial={{ opacity: 0, x: 80, filter: "blur(10px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -80, filter: "blur(10px)" }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="max-w-4xl mx-auto text-center px-8"
              >
                <motion.div 
                  className="flex justify-center mb-12"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 6, repeat: Infinity }}
                >
                  <img 
                    src={testimonials[activeTestimonial].image} 
                    alt="" 
                    className="w-32 h-32 rounded-3xl object-cover ring-8 ring-offset-8 ring-offset-black ring-cyan-400/30"
                  />
                </motion.div>
                
                <blockquote className="text-4xl leading-tight font-light tracking-tight text-balance mb-16 text-zinc-200">
                  “{testimonials[activeTestimonial].quote}”
                </blockquote>

                <div>
                  <p className="font-semibold text-2xl">{testimonials[activeTestimonial].name}</p>
                  <p className="text-cyan-400 tracking-widest text-sm mt-1">{testimonials[activeTestimonial].role}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Futuristic Navigation Dots */}
          <div className="flex justify-center gap-6 mt-16">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTestimonial(idx)}
                className={`relative w-4 h-4 rounded-full transition-all duration-500 ${
                  activeTestimonial === idx 
                    ? "bg-white scale-150 shadow-[0_0_20px_#67e8f9]" 
                    : "bg-white/20 hover:bg-white/60"
                }`}
              >
                {activeTestimonial === idx && (
                  <motion.div 
                    layoutId="activeDot"
                    className="absolute inset-0 bg-cyan-400 rounded-full -z-10"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Epic Holographic */}
      <div className="bg-gradient-to-br from-cyan-500 via-violet-600 to-fuchsia-600 py-40 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(white_1px,transparent_1px)] bg-[length:60px_60px] opacity-10" />
        
        <div className="max-w-4xl mx-auto text-center px-6 relative z-10">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-7xl md:text-8xl font-bold tracking-[-3px] text-white mb-10"
          >
            THE FUTURE IS<br />ALREADY HERE
          </motion.h2>
          
          <p className="text-3xl text-white/90 mb-16 tracking-tight">Join the 3026 standard.</p>

          <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
            <Link 
              href="/register" 
              className="inline-flex px-20 py-8 bg-black text-white text-3xl font-bold rounded-3xl items-center gap-6 shadow-2xl shadow-black/70 hover:shadow-cyan-400/40 transition-all"
            >
              TRANSMIT TO PULSE
              <ArrowRight className="w-9 h-9" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[100] p-6">
          <button 
            onClick={() => setShowVideo(false)} 
            className="absolute top-10 right-10 text-7xl text-white hover:text-cyan-300 transition-colors z-10"
          >
            ✕
          </button>
          <div className="w-full max-w-6xl aspect-video bg-black rounded-3xl overflow-hidden border border-cyan-400/30 shadow-2xl">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/6COcjDv1s50?autoplay=1"
              title="Pulse Demo"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}