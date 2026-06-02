"use client";

import React, { useState } from "react";
import {
  MessageCircle,
  Users,
  Shield,
  Zap,
  Star,
  ArrowRight,
} from "lucide-react";
import Link from 'next/link'

export default function Home() {
  const [showVideo, setShowVideo] = useState(false);
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6 relative">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-full mb-6 border border-white/10">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium">
              Real-time • End-to-End Encrypted
            </span>
          </div>

          <h1 className="text-7xl md:text-8xl font-bold tracking-tighter leading-tight mb-6">
            Chat that feels
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">
              alive
            </span>
          </h1>

          <p className="text-2xl text-gray-400 max-w-2xl mx-auto mb-10">
            Lightning-fast messaging with presence, typing indicators, and
            seamless group conversations. Built for teams and communities.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link href="/chat" className="px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl font-semibold text-lg flex items-center gap-3 hover:scale-105 transition-all active:scale-95">
              Start Chatting Now
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setShowVideo(true)}
              className="px-8 py-4 border border-white/20 rounded-2xl font-medium text-lg hover:bg-white/5 transition-all"
            >
              Watch 1:42 Demo
            </button>
          </div>

          <div className="mt-10 text-sm text-gray-500 flex items-center justify-center gap-8">
            <div>✦ Trusted by 50,000+ users</div>
            <div>✦ SOC 2 Certified</div>
            <div>✦ 99.99% Uptime</div>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="mt-20 max-w-6xl mx-auto relative">
          <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-3xl p-3 shadow-2xl">
            <div className="bg-zinc-950 rounded-2xl overflow-hidden">
              {/* Fake Chat Interface */}
              <div className="h-[520px] flex">
                {/* Sidebar */}
                <div className="w-72 border-r border-white/10 p-4 hidden lg:block">
                  <div className="flex items-center justify-between mb-6">
                    <div className="font-semibold">Workspace</div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="space-y-1">
                    {["General", "Engineering", "Design", "Marketing"].map(
                      (room, i) => (
                        <div
                          key={i}
                          className={`px-4 py-3 rounded-xl flex items-center gap-3 ${i === 0 ? "bg-white/10" : "hover:bg-white/5"}`}
                        >
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>{room}</span>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col">
                  <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl"></div>
                      <div>
                        <div className="font-semibold">Product Launch</div>
                        <div className="text-green-500 text-sm flex items-center gap-1">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                          12 online
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 p-6 space-y-6 overflow-hidden">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-zinc-700 rounded-full"></div>
                      <div>
                        <div className="text-sm text-gray-400">
                          Sarah Chen • just now
                        </div>
                        <div className="mt-1">
                          The new dashboard looks incredible! Can we ship this
                          tomorrow?
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 justify-end">
                      <div className="max-w-xs text-right">
                        <div className="text-sm text-gray-400">
                          You • just now
                        </div>
                        <div className="mt-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-3 rounded-3xl rounded-tr-none inline-block">
                          Definitely. I just pushed the final changes.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-t border-white/10">
                    <div className="bg-zinc-900 rounded-2xl px-6 py-4 flex items-center">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 bg-transparent outline-none text-lg placeholder:text-gray-500"
                      />
                      <button className="bg-white text-black px-6 py-2 rounded-xl font-medium">
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold tracking-tight mb-4">
              Built for speed and clarity
            </h2>
            <p className="text-xl text-gray-400">
              Everything you need for meaningful conversations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Lightning Fast",
                desc: "Messages delivered under 100ms with WebSocket optimization",
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "End-to-End Encrypted",
                desc: "Your conversations are private by default. Always.",
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Smart Groups",
                desc: "Channels, threads, and powerful permissions",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-zinc-900/50 border border-white/10 rounded-3xl p-10 hover:border-violet-500/30 transition-all group"
              >
                <div className="text-violet-400 mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <div className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-5xl font-bold mb-6">
            Ready to transform how you communicate?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Join thousands of teams already using Pulse.
          </p>

          <Link href="/register" className="px-10 py-5 bg-black text-white text-xl font-semibold rounded-2xl hover:scale-105 transition-all flex items-center gap-3 mx-auto w-fit">
            Create Your Workspace — It's Free
            <ArrowRight className="w-6 h-6" />
          </Link>
          <p className="text-sm mt-4 text-white/70">
            No credit card required • Cancel anytime
          </p>
        </div>
      </div>
      {showVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          {/* Close button */}
          <button
            onClick={() => setShowVideo(false)}
            className="absolute top-6 right-6 text-white text-3xl"
          >
            ✕
          </button>

          {/* Video container */}
          <div className="w-[90%] max-w-3xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/6COcjDv1s50?autoplay=1"
              title="Demo Video"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
