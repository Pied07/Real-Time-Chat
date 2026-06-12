"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Send, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      alert("Transmission received. We'll synchronize shortly.");
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-transparent text-white font-mono pt-32 overflow-hidden">
      {/* Hero */}
      <section className="pb-20 px-6 relative">
        <div className="absolute inset-0 bg-[radial-gradient(at_50%_0%,#3b82f630_0%,transparent_50%)]" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex px-6 py-2 border border-blue-400/30 bg-blue-400/5 rounded-full mb-8 text-xs tracking-[4px] text-blue-300"
          >
            COMMUNICATION PROTOCOL
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-[90px] font-bold tracking-[-4px] leading-[1] mb-8 bg-gradient-to-br from-white via-blue-200 to-cyan-300 bg-clip-text text-transparent"
          >
            ESTABLISH LINK
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl text-zinc-400 max-w-2xl mx-auto font-light tracking-[-0.5px]"
          >
            Initiate a secure quantum handshake with our prime architects.
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="grid md:grid-cols-2 gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-zinc-900/60 backdrop-blur-xl border border-white/10 p-10 rounded-3xl"
          >
            <h2 className="text-4xl font-bold tracking-tight mb-8">Send Transmission</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-[2px] mb-3 text-zinc-500">Identity Alias</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all text-white placeholder:text-zinc-600"
                    placeholder="Neo"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[2px] mb-3 text-zinc-500">Node Address (Email)</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all text-white placeholder:text-zinc-600"
                    placeholder="neo@matrix.grid"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-[2px] mb-3 text-zinc-500">Transmission Vector</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all text-white placeholder:text-zinc-600"
                  placeholder="Inquiry Subject"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-[2px] mb-3 text-zinc-500">Payload</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full bg-black/50 border border-white/10 rounded-3xl px-6 py-5 outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all text-white placeholder:text-zinc-600 resize-y"
                  placeholder="Enter encrypted message here..."
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={submitted}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 py-5 rounded-2xl font-bold tracking-[2px] text-black text-lg flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {submitted ? "UPLOADING..." : "TRANSMIT"}
                <Send className={`w-5 h-5 ${submitted ? 'animate-ping' : ''}`} />
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-12"
          >
            <div>
              <h2 className="text-4xl font-bold tracking-tight mb-8">Grid Coordinates</h2>
              <p className="text-zinc-400 text-lg font-light">
                Our architects are monitoring the channels. Expected response latency: {"<"}24 hours.
              </p>
            </div>

            <div className="space-y-8">
              {[
                { icon: Mail, label: "Direct Comms", value: "hello@pulse.grid", link: "mailto:hello@pulse.chat", color: "blue" },
                { icon: Phone, label: "Voice Frequency", value: "+91 98765 43210", link: "tel:+919876543210", color: "cyan" },
                { icon: MapPin, label: "Physical Node", value: "Kolkata, Earth Dimension", link: "#", color: "fuchsia" },
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ x: 10 }}
                  className="flex gap-6 group"
                >
                  <div className={`w-14 h-14 bg-${item.color}-500/10 rounded-2xl flex items-center justify-center text-${item.color}-400 border border-${item.color}-500/20 group-hover:bg-${item.color}-500/20 transition-colors`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold tracking-[2px] text-xs uppercase text-zinc-500 mb-1">{item.label}</p>
                    <a href={item.link} className="text-xl font-medium text-white group-hover:text-cyan-400 transition-colors">
                      {item.value}
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="pt-8 border-t border-white/10">
              <p className="text-sm text-zinc-500 tracking-[1px] uppercase">
                Prefer a live hologram? <br />
                <Link href="/register" className="text-cyan-400 hover:text-cyan-300 font-bold tracking-[2px] mt-2 inline-block">
                  INITIALIZE DEMO <ArrowRight className="inline w-4 h-4" />
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-gradient-to-br from-blue-900/50 via-cyan-900/50 to-emerald-900/50 py-32 border-t border-white/10 relative overflow-hidden mt-20">
        <div className="absolute inset-0 bg-[radial-gradient(white_1px,transparent_1px)] bg-[length:40px_40px] opacity-5" />
        <div className="max-w-4xl mx-auto text-center px-6 relative z-10">
          <h2 className="text-5xl font-bold tracking-tighter mb-8">Ready to upgrade your comms?</h2>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              href="/register"
              className="inline-flex items-center gap-4 px-12 py-6 bg-white text-black rounded-3xl text-xl font-bold hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all"
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