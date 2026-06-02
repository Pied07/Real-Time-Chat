"use client";

import React from "react";
import Link from 'next/link';
import { 
  Zap, Shield, Users, Clock, 
  HelpCircle, Users2, Gift, 
  FileText, Scale, Lock, Award 
} from "lucide-react";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-black text-white mt-20">

      <div className="pt-24 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tighter mb-6">
            Features that make<br/> 
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">communication effortless</span>
          </h1>
          <p className="text-2xl text-gray-400 max-w-2xl mx-auto">
            Everything your team needs to stay connected, aligned, and productive.
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <section className="py-20 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-10 h-10 text-violet-400" />,
                title: "Lightning Fast Messaging",
                desc: "Messages delivered in under 100ms with optimized WebSocket connections. Real-time presence and typing indicators."
              },
              {
                icon: <Shield className="w-10 h-10 text-emerald-400" />,
                title: "End-to-End Encryption",
                desc: "Your conversations are private by default. Zero-knowledge architecture ensures even we can't read your messages."
              },
              {
                icon: <Users className="w-10 h-10 text-fuchsia-400" />,
                title: "Smart Channels & Threads",
                desc: "Organized conversations with threaded replies, powerful permissions, and role-based access control."
              },
              {
                icon: <Clock className="w-10 h-10 text-amber-400" />,
                title: "Presence & Activity",
                desc: "See who's online, away, or in a meeting. Get notified when someone is typing or joins a channel."
              },
              {
                icon: <Users2 className="w-10 h-10 text-sky-400" />,
                title: "Seamless Group Chats",
                desc: "Unlimited members, file sharing up to 1GB, voice messages, reactions, and rich embeds."
              },
              {
                icon: <Gift className="w-10 h-10 text-rose-400" />,
                title: "Integrations & Bots",
                desc: "Connect with Slack, GitHub, Figma, Notion, Linear, and more. Build custom bots with our API."
              }
            ].map((feature, i) => (
              <div key={i} className="bg-zinc-900/50 border border-white/10 rounded-3xl p-10 hover:border-violet-500/40 group transition-all">
                <div className="mb-8">{feature.icon}</div>
                <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 py-24">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-5xl font-bold mb-6">Ready to experience the difference?</h2>
          <Link href="/register" className="inline-flex px-10 py-5 bg-black text-white text-xl font-semibold rounded-2xl hover:scale-105 transition-all items-center gap-3">
            Start for Free
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}