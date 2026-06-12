"use client";

import React, { useState } from "react";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Zap, Search, Plus, ExternalLink, ArrowRight
} from "lucide-react";

const integrations = [
  { name: "Slack", category: "Communication", color: "bg-[#4A154B]", icon: "🔗" },
  { name: "GitHub", category: "Development", color: "bg-black", icon: "🐙" },
  { name: "Figma", category: "Design", color: "bg-[#A259FF]", icon: "🎨" },
  { name: "Notion", category: "Productivity", color: "bg-black", icon: "📝" },
  { name: "Linear", category: "Development", color: "bg-black", icon: "⚡" },
  { name: "Google Drive", category: "Storage", color: "bg-[#4285F4]", icon: "📁" },
  { name: "Zoom", category: "Communication", color: "bg-[#2D8CFF]", icon: "📹" },
  { name: "Calendar", category: "Productivity", color: "bg-[#34A853]", icon: "📅" },
  { name: "Trello", category: "Productivity", color: "bg-[#0079BF]", icon: "📋" },
  { name: "Jira", category: "Development", color: "bg-[#0052CC]", icon: "🔷" },
  { name: "Dropbox", category: "Storage", color: "bg-[#0061FF]", icon: "📦" },
  { name: "Microsoft Teams", category: "Communication", color: "bg-[#6264A7]", icon: "💬" },
];

export default function IntegrationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Communication", "Development", "Design", "Productivity", "Storage"];

  const filteredIntegrations = integrations.filter((integration) => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || integration.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-transparent text-white font-mono pt-32 overflow-hidden">

      {/* Hero */}
      <div className="pb-20 px-6 relative">
        <div className="absolute inset-0 bg-[radial-gradient(at_50%_0%,#3b82f630_0%,transparent_50%)]" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex px-6 py-2 border border-blue-400/30 bg-blue-400/5 rounded-full mb-8 text-xs tracking-[4px] text-blue-300"
          >
            GRID EXTENSIONS
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-[90px] font-bold tracking-[-4px] leading-[1] mb-8 bg-gradient-to-br from-white via-blue-200 to-cyan-300 bg-clip-text text-transparent"
          >
            CONNECT<br />EVERYTHING
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl text-zinc-400 max-w-2xl mx-auto font-light tracking-[-0.5px]"
          >
            Seamlessly integrate the Pulse neural grid with the legacy tools your team already uses.
          </motion.p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="sticky top-20 z-40 bg-zinc-950/80 backdrop-blur-xl border-y border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="relative flex-1 max-w-xl w-full">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-400" />
              <input
                type="text"
                placeholder="Search extensions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-2xl pl-14 py-4 text-sm font-bold tracking-[1px] focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(34,211,238,0.2)] placeholder:text-zinc-600 transition-all"
              />
            </div>

            <div className="flex gap-2 flex-wrap justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-3 rounded-full text-xs font-bold tracking-[1px] uppercase transition-all ${
                    activeCategory === category
                      ? "bg-cyan-500 text-black shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                      : "bg-zinc-900/50 hover:bg-zinc-800 border border-white/10 hover:border-cyan-400/50"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Integrations Grid */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredIntegrations.map((integration, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -5 }}
                className="group bg-zinc-900/60 backdrop-blur-md border border-white/10 hover:border-cyan-400/50 rounded-3xl p-8 transition-all hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className={`w-16 h-16 ${integration.color} rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-lg group-hover:scale-110 transition-transform border border-white/20`}>
                  {integration.icon}
                </div>
                
                <h3 className="text-2xl font-bold tracking-tight mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-cyan-400 transition-all">{integration.name}</h3>
                <p className="text-zinc-500 font-bold text-xs tracking-[2px] uppercase mb-8">{integration.category}</p>

                <div className="flex items-center justify-between border-t border-white/10 pt-6">
                  <span className="text-xs font-bold tracking-[1px] uppercase text-emerald-400 flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
                    Ready
                  </span>
                  <button className="text-cyan-400 group-hover:text-cyan-300 flex items-center gap-2 text-xs font-bold tracking-[1px] uppercase transition-colors">
                    Link Node <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Request Integration */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-32 border border-dashed border-cyan-500/30 bg-cyan-500/5 rounded-3xl p-16 text-center backdrop-blur-sm"
          >
            <div className="mx-auto w-20 h-20 bg-cyan-500/20 rounded-2xl flex items-center justify-center mb-8 border border-cyan-500/30">
              <Plus className="w-10 h-10 text-cyan-400" />
            </div>
            <h3 className="text-4xl font-bold tracking-tight mb-4">Missing a dimension?</h3>
            <p className="text-zinc-400 max-w-lg mx-auto mb-10 font-light text-lg">
              Our architects are constantly adding new API routes. Submit a request to expand the grid.
            </p>
            <button className="px-10 py-5 bg-zinc-900 border border-white/10 hover:border-cyan-400 text-white font-bold tracking-[2px] uppercase rounded-full hover:bg-white/5 transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              Submit Request
            </button>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <div className="bg-gradient-to-br from-blue-900/50 via-cyan-900/50 to-emerald-900/50 py-32 relative overflow-hidden mt-20">
        <div className="absolute inset-0 bg-[radial-gradient(white_1px,transparent_1px)] bg-[length:40px_40px] opacity-5" />
        <div className="max-w-4xl mx-auto text-center px-6 relative z-10">
          <h2 className="text-5xl font-bold tracking-tighter mb-8">Ready to sync your tools?</h2>
          <p className="text-xl text-zinc-300 font-light mb-12">Join thousands of nodes using Pulse with their legacy apps.</p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              href="/register" 
              className="inline-flex px-12 py-6 bg-white text-black text-xl font-bold tracking-[1px] uppercase rounded-3xl hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all items-center gap-4"
            >
              INITIALIZE NOW
              <ArrowRight className="w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}