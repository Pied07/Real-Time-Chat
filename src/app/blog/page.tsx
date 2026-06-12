"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const blogPosts = [
  {
    slug: "future-of-team-communication",
    title: "The Future of Team Communication in 3026",
    excerpt: "How real-time quantum messaging, AI, and neural privacy are shaping the next generation of workspace tools.",
    date: "May 28, 2026",
    readTime: "8 min",
    category: "Trends",
    image: "🚀"
  },
  {
    slug: "why-end-to-end-encryption-matters",
    title: "Why Neural Encryption Should Be Default",
    excerpt: "Understanding the importance of privacy in modern dimensional communication platforms.",
    date: "May 20, 2026",
    readTime: "6 min",
    category: "Security",
    image: "🔒"
  },
  {
    slug: "how-we-built-pulse",
    title: "How We Built Pulse: Lessons from Building the Grid",
    excerpt: "Technical deep dive into WebSockets, scaling, and delivering sub-1ms quantum messaging.",
    date: "May 15, 2026",
    readTime: "12 min",
    category: "Engineering",
    image: "⚙️"
  },
  {
    slug: "remote-work-communication-tips",
    title: "10 Communication Tips for Multi-Dimensional Teams",
    excerpt: "Practical strategies to improve collaboration and reduce holographic meeting fatigue.",
    date: "May 10, 2026",
    readTime: "5 min",
    category: "Productivity",
    image: "🌍"
  },
];

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = ["All", "Trends", "Security", "Engineering", "Productivity"];

  const filteredPosts = selectedCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-transparent text-white font-mono pt-32 overflow-hidden">
      {/* Hero */}
      <section className="pb-20 px-6 relative">
        <div className="absolute inset-0 bg-[radial-gradient(at_50%_0%,#ec489930_0%,transparent_50%)]" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex px-6 py-2 border border-fuchsia-400/30 bg-fuchsia-400/5 rounded-full mb-8 text-xs tracking-[4px] text-fuchsia-300"
          >
            TRANSMISSION LOGS
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-[90px] font-bold tracking-[-4px] leading-[1] mb-8 bg-gradient-to-br from-white via-fuchsia-200 to-cyan-300 bg-clip-text text-transparent"
          >
            PULSE BLOG
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl text-zinc-400 max-w-2xl mx-auto font-light tracking-[-0.5px]"
          >
            Insights, updates, and stories from the neural grid builders.
          </motion.p>
        </div>
      </section>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-6 py-8 border-b border-white/10 relative z-10">
        <div className="flex flex-wrap gap-4 justify-center">
          {categories.map((cat, i) => (
            <motion.button
              key={cat}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedCategory(cat)}
              className={`px-8 py-3 rounded-full text-sm font-semibold tracking-[1px] transition-all duration-300 ${
                selectedCategory === cat 
                  ? 'bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-black shadow-[0_0_20px_rgba(232,121,249,0.4)]' 
                  : 'bg-zinc-900/50 backdrop-blur-md hover:bg-zinc-800 border border-white/10 hover:border-fuchsia-400/50 text-zinc-300'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Blog Posts Grid */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, i) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <Link 
                  href={`/blog/${post.slug}`}
                  className="group block bg-zinc-950/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-cyan-400/50 transition-all duration-500 h-full shadow-lg"
                >
                  <div className="h-64 flex items-center justify-center bg-gradient-to-br from-zinc-900 to-black text-7xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff10_0%,transparent_70%)]" />
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      {post.image}
                    </motion.div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-4 text-xs font-mono tracking-[2px] uppercase text-zinc-500 mb-6">
                      <span>{post.date}</span>
                      <span className="text-cyan-400">•</span>
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-cyan-400" /> {post.readTime}
                      </span>
                    </div>
                    <h3 className="text-3xl font-semibold tracking-tight mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-fuchsia-400 transition-all duration-300">
                      {post.title}
                    </h3>
                    <p className="text-zinc-400 font-light leading-relaxed line-clamp-3 mb-8">{post.excerpt}</p>
                    <div className="text-cyan-400 flex items-center gap-3 text-sm font-semibold tracking-[2px] uppercase">
                      Decrypt Log <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}