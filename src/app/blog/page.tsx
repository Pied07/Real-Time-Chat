"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { MessageCircle, Calendar, Clock, ArrowRight } from 'lucide-react';

const blogPosts = [
  {
    slug: "future-of-team-communication",
    title: "The Future of Team Communication in 2026",
    excerpt: "How real-time messaging, AI, and privacy are shaping the next generation of workplace tools.",
    date: "May 28, 2026",
    readTime: "8 min",
    category: "Trends",
    image: "🚀"
  },
  {
    slug: "why-end-to-end-encryption-matters",
    title: "Why End-to-End Encryption Should Be Default",
    excerpt: "Understanding the importance of privacy in modern communication platforms.",
    date: "May 20, 2026",
    readTime: "6 min",
    category: "Security",
    image: "🔒"
  },
  {
    slug: "how-we-built-pulse",
    title: "How We Built Pulse: Lessons from Building a Real-time Chat App",
    excerpt: "Technical deep dive into WebSockets, scaling, and delivering sub-100ms messaging.",
    date: "May 15, 2026",
    readTime: "12 min",
    category: "Engineering",
    image: "⚙️"
  },
  {
    slug: "remote-work-communication-tips",
    title: "10 Communication Tips for Remote Teams",
    excerpt: "Practical strategies to improve collaboration and reduce meeting fatigue.",
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
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-black to-zinc-950">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tighter mb-6">Pulse Blog</h1>
          <p className="text-2xl text-gray-400">Insights, updates, and stories from the Pulse team</p>
        </div>
      </section>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-6 py-8 border-b border-white/10">
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat 
                  ? 'bg-violet-600 text-white' 
                  : 'bg-zinc-900 hover:bg-zinc-800 border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Posts Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Link 
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden hover:border-violet-500/30 transition-all hover:scale-[1.02]"
              >
                <div className="h-64 flex items-center justify-center bg-gradient-to-br from-zinc-800 to-black text-7xl">
                  {post.image}
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 group-hover:text-violet-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 line-clamp-3 mb-6">{post.excerpt}</p>
                  <div className="text-violet-400 flex items-center gap-2 text-sm font-medium">
                    Read Article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}