"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageCircle, Zap, Shield, Heart, ArrowRight, Users, Globe, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function About() {
  const [activeValue, setActiveValue] = useState(0);
  const [counters, setCounters] = useState({ 
    users: 0, 
    messages: 0, 
    countries: 0, 
    uptime: 0 
  });

  // Smooth Counter Animation starting from 0
  useEffect(() => {
    const animateCounters = () => {
      const targets = { 
        users: 50000, 
        messages: 25000000, 
        countries: 87, 
        uptime: 99.99 
      };
      
      Object.keys(targets).forEach((key) => {
        let start = 0;
        const end = targets[key as keyof typeof targets];
        const duration = 2000;
        const increment = end / (duration / 20);

        const timer = setInterval(() => {
          start += increment;
          if (start >= end) {
            setCounters(prev => ({ ...prev, [key]: end }));
            clearInterval(timer);
          } else {
            setCounters(prev => ({ 
              ...prev, 
              [key]: key === 'uptime' ? parseFloat(start.toFixed(2)) : Math.floor(start) 
            }));
          }
        }, 20);
      });
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCounters();
      }
    }, { threshold: 0.5 });

    const statsSection = document.getElementById('stats');
    if (statsSection) observer.observe(statsSection);

    return () => observer.disconnect();
  }, []);

  const values = [
    { icon: <Zap className="w-8 h-8" />, title: "Speed First", desc: "Every message should feel instant. Neural transmission speed.", color: "cyan" },
    { icon: <Shield className="w-8 h-8" />, title: "Privacy by Design", desc: "Your conversations are protected by quantum-level encryption.", color: "emerald" },
    { icon: <Heart className="w-8 h-8" />, title: "Human Connection", desc: "Technology that bridges physical dimensions to bring minds closer.", color: "fuchsia" },
  ];

  return (
    <div className="min-h-screen bg-transparent text-white font-mono pt-32 overflow-hidden">

      {/* Hero */}
      <section className="pb-20 px-6 relative">
        <div className="absolute inset-0 bg-[radial-gradient(at_50%_0%,#7c3aed30_0%,transparent_50%)]" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex px-6 py-2 border border-cyan-400/30 bg-cyan-400/5 rounded-full mb-8 text-xs tracking-[4px] text-cyan-300"
          >
            ORIGIN STORY
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-[90px] font-bold tracking-[-4px] leading-[1] mb-8 bg-gradient-to-br from-white via-cyan-200 to-violet-300 bg-clip-text text-transparent"
          >
            WE BELIEVE IN<br/>BETTER CONVERSATIONS
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl text-zinc-400 max-w-2xl mx-auto font-light tracking-[-0.5px]"
          >
            Pulse was born from frustration with slow, cluttered, and insecure tools. Welcome to the 3026 standard.
          </motion.p>
        </div>
      </section>

      {/* Story + Mission + Vision */}
      <section className="py-24 border-y border-white/10 relative bg-zinc-950/50 backdrop-blur-3xl">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl font-bold tracking-tight mb-8">System Architecture Origin</h2>
              <div className="space-y-6 text-lg text-zinc-300 font-light">
                <p>Founded in 2024, Pulse started as a side project between three friends tired of using outdated communication protocols.</p>
                <p>We wanted a chat experience that was <span className="text-cyan-400 font-semibold">blazing fast</span>, dimensionally beautiful, and truly private.</p>
                <p>Today, Pulse is trusted by over 50,000 active neural nodes across startups and global communities.</p>
              </div>
            </motion.div>

            <div className="space-y-8">
              {[
                { emoji: "🎯", title: "Primary Mission", desc: "To make digital communication feel as natural and delightful as face-to-face syncs." },
                { emoji: "🌟", title: "Future Vision", desc: "To become the central communication grid where every team feels truly connected." }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-zinc-900/70 border border-white/10 rounded-3xl p-10 backdrop-blur-xl relative overflow-hidden group hover:border-cyan-400/50 transition-colors"
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-4xl">{item.emoji}</div>
                    <h3 className="text-3xl font-semibold tracking-tight">{item.title}</h3>
                  </div>
                  <p className="text-zinc-400 text-lg leading-relaxed font-light">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Values */}
      <section className="py-32 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold tracking-tight mb-4">Core Directives</h2>
            <p className="text-xl text-zinc-400 tracking-[2px] uppercase text-sm">System values</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10, scale: 1.02 }}
                onMouseEnter={() => setActiveValue(index)}
                onClick={() => setActiveValue(index)}
                className={`group p-10 rounded-3xl border transition-all duration-500 cursor-pointer backdrop-blur-xl bg-zinc-950/60 ${
                  activeValue === index ? 'border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.2)]' : 'border-white/10 hover:border-white/30'
                }`}
              >
                <div className={`text-${value.color}-400 mb-6 transition-transform group-hover:scale-110 duration-300`}>
                  {value.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-4 tracking-tight">{value.title}</h3>
                <p className="text-zinc-400 leading-relaxed font-light">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-32 bg-zinc-950/90 border-y border-white/10 backdrop-blur-3xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#ffffff05_0,#ffffff05_2px,transparent_2px,transparent_40px)]" />
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold tracking-tight">Global Network Status</h2>
            <p className="text-zinc-400 mt-3 tracking-[2px] uppercase text-xs">Real-time metrics</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Users className="w-9 h-9 text-cyan-400" />, number: counters.users, suffix: "+", label: "Active Nodes", color: "cyan" },
              { icon: <MessageCircle className="w-9 h-9 text-fuchsia-400" />, number: counters.messages, suffix: "+", label: "Quantum Messages", color: "fuchsia" },
              { icon: <Globe className="w-9 h-9 text-violet-400" />, number: counters.countries, suffix: "", label: "Dimensions", color: "violet" },
              { icon: <Clock className="w-9 h-9 text-emerald-400" />, number: counters.uptime, suffix: "%", label: "Grid Uptime", color: "emerald" },
            ].map((stat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-black/50 rounded-3xl p-10 text-center border border-white/10 hover:border-cyan-400/50 transition-all duration-300 group backdrop-blur-md"
              >
                <div className="flex justify-center mb-6 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
                  {stat.icon}
                </div>
                <div className={`text-5xl font-bold tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-${stat.color}-400`}>
                  {stat.number.toLocaleString()}{stat.suffix}
                </div>
                <p className="text-zinc-500 font-medium tracking-[2px] uppercase text-xs">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold tracking-tight">System Architects</h2>
            <p className="text-zinc-400 mt-4 tracking-[2px] uppercase text-xs">The builders of the grid</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Sarah Chen", role: "Prime Architect", image: "👩🏻‍💼" },
              { name: "Rahul Sharma", role: "Quantum Engineer", image: "👨🏽‍💻" },
              { name: "Priya Malhotra", role: "Dimensional Designer", image: "👩🏾‍🎨" },
            ].map((member, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -10 }}
                className="bg-zinc-900/60 backdrop-blur-xl rounded-3xl p-10 text-center transition-all duration-300 border border-white/10 hover:border-cyan-400/50 group"
              >
                <div className="text-7xl mb-6 group-hover:scale-110 transition-transform">{member.image}</div>
                <h3 className="text-2xl font-semibold tracking-tight">{member.name}</h3>
                <p className="text-cyan-400 mt-2 font-mono text-xs tracking-[2px] uppercase">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <div className="bg-gradient-to-br from-cyan-900/50 via-violet-900/50 to-fuchsia-900/50 py-32 border-t border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(white_1px,transparent_1px)] bg-[length:40px_40px] opacity-5" />
        <div className="max-w-4xl mx-auto text-center px-6 relative z-10">
          <h2 className="text-5xl font-bold mb-8 tracking-tighter">Ready to join the grid?</h2>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              href="/register"
              className="inline-flex items-center gap-4 px-12 py-6 bg-white text-black rounded-3xl text-xl font-bold hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all"
            >
              INITIALIZE WORKSPACE
              <ArrowRight className="w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}