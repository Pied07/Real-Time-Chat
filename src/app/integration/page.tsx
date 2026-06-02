"use client";

import React, { useState } from "react";
import Link from 'next/link';
import { 
  Zap, Shield, Users, Search, Plus, ExternalLink 
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
    <div className="min-h-screen bg-black text-white mt-20">

      {/* Hero */}
      <div className="pt-24 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-full mb-6">
            <Zap className="w-5 h-5 text-violet-400" />
            <span className="text-sm font-medium">Works with your favorite tools</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold tracking-tighter mb-6">
            Connect everything.<br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">
              Work better.
            </span>
          </h1>
          <p className="text-2xl text-gray-400 max-w-2xl mx-auto">
            Seamlessly integrate Pulse with the tools your team already uses.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="sticky top-20 z-40 bg-zinc-950 border-b border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search integrations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 rounded-2xl pl-14 py-4 text-lg focus:outline-none focus:border-violet-500 placeholder:text-gray-500"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-3 rounded-2xl text-sm font-medium transition-all ${
                    activeCategory === category
                      ? "bg-violet-600 text-white"
                      : "bg-zinc-900 hover:bg-zinc-800 border border-white/10"
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
      <section className="py-20 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIntegrations.map((integration, i) => (
              <div
                key={i}
                className="group bg-zinc-900/70 border border-white/10 hover:border-violet-500/50 rounded-3xl p-8 transition-all hover:-translate-y-1"
              >
                <div className={`w-16 h-16 ${integration.color} rounded-2xl flex items-center justify-center text-4xl mb-6`}>
                  {integration.icon}
                </div>
                
                <h3 className="text-2xl font-semibold mb-2">{integration.name}</h3>
                <p className="text-gray-400 mb-6">{integration.category}</p>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-400 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Connected
                  </span>
                  <button className="text-violet-400 group-hover:text-violet-300 flex items-center gap-1 text-sm font-medium">
                    Connect <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Request Integration */}
          <div className="mt-20 border border-dashed border-white/20 rounded-3xl p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
              <Plus className="w-8 h-8" />
            </div>
            <h3 className="text-3xl font-semibold mb-3">Don’t see your tool?</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-8">
              We’re constantly adding new integrations. Let us know what you need.
            </p>
            <button className="px-8 py-4 bg-white text-black font-semibold rounded-2xl hover:bg-white/90 transition-all">
              Request Integration
            </button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <div className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 py-24">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-5xl font-bold mb-6">Ready to bring your tools together?</h2>
          <p className="text-xl text-white/90 mb-10">Join thousands of teams using Pulse with their favorite apps.</p>
          <Link 
            href="/register" 
            className="inline-flex px-10 py-5 bg-black text-white text-xl font-semibold rounded-2xl hover:scale-105 transition-all items-center gap-3"
          >
            Start Free — No Credit Card Needed
          </Link>
        </div>
      </div>
    </div>
  );
}