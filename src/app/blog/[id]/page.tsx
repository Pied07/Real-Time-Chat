"use client";

import React from 'react';
import Link from 'next/link';
import { MessageCircle, ArrowLeft } from 'lucide-react';

const blogData = {
  "future-of-team-communication": {
    title: "The Future of Team Communication in 2026",
    date: "May 28, 2026",
    readTime: "8 min read",
    author: "Sarah Chen",
    content: `
      <p>The way we communicate at work is evolving faster than ever before. With distributed teams becoming the norm, the demand for tools that feel both powerful and natural has never been higher.</p>
      
      <h3>1. Real-time Everything</h3>
      <p>Latency is no longer acceptable. Teams expect messages to appear instantly.</p>

      <h3>2. Privacy as a Standard</h3>
      <p>End-to-end encryption should be the default, not an option.</p>
    `,
  },
};

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = blogData[params.slug as keyof typeof blogData];

  if (!post) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-7xl font-bold mb-4 text-violet-400">404</h1>
          <p className="text-2xl text-gray-400 mb-8">Blog post not found</p>
          <Link 
            href="/blog" 
            className="inline-block px-8 py-4 bg-violet-600 hover:bg-violet-700 rounded-2xl font-medium transition"
          >
            ← Back to All Articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/blog" className="flex items-center gap-2 text-sm hover:text-violet-400 transition">
            <ArrowLeft className="w-5 h-5" /> Back to Blog
          </Link>
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tighter">Pulse</span>
          </Link>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-6 pt-32 pb-24">
        <div className="mb-12">
          <div className="text-sm text-gray-400 mb-6">
            {post.date} • {post.readTime}
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter leading-tight mb-8">
            {post.title}
          </h1>
          <p className="text-gray-400">By {post.author}</p>
        </div>

        <div 
          className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-20 pt-12 border-t border-white/10">
          <Link href="/blog" className="text-violet-400 hover:text-white transition flex items-center gap-2">
            ← Back to all articles
          </Link>
        </div>
      </article>
    </div>
  );
}