"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { MessageCircle, ArrowRight, Users, Zap, Shield, Globe, Send } from 'lucide-react';

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      number: "01",
      title: "Create Your Workspace",
      desc: "Sign up in seconds and create or join a workspace. Invite your team with a single link.",
      icon: <Users className="w-8 h-8" />,
      color: "violet"
    },
    {
      number: "02",
      title: "Connect Instantly",
      desc: "Real-time connection via WebSockets. See who's online and start chatting immediately.",
      icon: <Zap className="w-8 h-8" />,
      color: "fuchsia"
    },
    {
      number: "03",
      title: "Organize Conversations",
      desc: "Create channels, threads, and direct messages. Keep everything perfectly organized.",
      icon: <MessageCircle className="w-8 h-8" />,
      color: "cyan"
    },
    {
      number: "04",
      title: "Communicate Securely",
      desc: "End-to-end encryption ensures your messages stay private and protected.",
      icon: <Shield className="w-8 h-8" />,
      color: "emerald"
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-black to-zinc-950">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tighter mb-6">
            Simple. Fast.<br />
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">Powerful.</span>
          </h1>
          <p className="text-2xl text-gray-400 max-w-2xl mx-auto">
            Getting started with Pulse takes less than 60 seconds. Here's exactly how it works.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            {/* Steps List */}
            <div className="md:col-span-5 space-y-6">
              {steps.map((step, index) => (
                <div
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`group p-8 rounded-3xl border transition-all cursor-pointer ${
                    activeStep === index
                      ? 'border-violet-500 bg-zinc-900'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-start gap-6">
                    <div className={`text-4xl font-bold text-gray-500 group-hover:text-violet-400 transition-colors ${activeStep === index ? 'text-violet-400' : ''}`}>
                      {step.number}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <div className={`text-${step.color}-400`}>{step.icon}</div>
                        <h3 className="text-2xl font-semibold">{step.title}</h3>
                      </div>
                      <p className="text-gray-400 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Preview / Interactive Area */}
            <div className="md:col-span-7">
              <div className="sticky top-24">
                <div className="bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                  <div className="bg-zinc-900 px-6 py-4 border-b border-white/10 flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="ml-4 text-sm text-gray-400">Pulse Preview • Product Launch</div>
                  </div>

                  <div className="h-[520px] p-8 flex flex-col">
                    {activeStep === 0 && (
                      <div className="flex-1 flex items-center justify-center text-center">
                        <div>
                          <div className="text-8xl mb-6">🎉</div>
                          <h3 className="text-3xl font-semibold mb-4">Welcome to Pulse!</h3>
                          <p className="text-gray-400 max-w-xs mx-auto">Your workspace is ready. Let's invite your team.</p>
                        </div>
                      </div>
                    )}

                    {activeStep === 1 && (
                      <div className="flex-1 flex flex-col justify-center items-center">
                        <div className="text-green-500 text-6xl mb-8 animate-pulse">⚡</div>
                        <h3 className="text-3xl font-semibold mb-3">Connected in Real-time</h3>
                        <p className="text-gray-400">Messages appear instantly</p>
                      </div>
                    )}

                    {activeStep === 2 && (
                      <div className="flex-1 space-y-6">
                        <div className="bg-zinc-900 p-4 rounded-2xl">💬 General</div>
                        <div className="bg-zinc-900 p-4 rounded-2xl">🚀 Product Launch</div>
                        <div className="bg-violet-600/20 p-4 rounded-2xl border border-violet-500">This is a thread</div>
                      </div>
                    )}

                    {activeStep === 3 && (
                      <div className="flex-1 flex flex-col justify-center items-center text-center">
                        <div className="text-6xl mb-8">🔒</div>
                        <h3 className="text-3xl font-semibold mb-3">End-to-End Encrypted</h3>
                        <p className="text-emerald-400">Only you and the recipient can read your messages</p>
                      </div>
                    )}

                    <div className="mt-auto pt-8 border-t border-white/10">
                      <button 
                        onClick={() => setActiveStep((prev) => (prev + 1) % steps.length)}
                        className="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl font-semibold flex items-center justify-center gap-3 hover:scale-105 transition-all"
                      >
                        Next Step <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-zinc-950">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold tracking-tight">Why teams love Pulse</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "⚡", title: "Lightning Fast", desc: "Under 100ms message delivery" },
              { icon: "🔒", title: "Military Grade Security", desc: "End-to-end encryption by default" },
              { icon: "🌍", title: "Works Everywhere", desc: "Desktop, Mobile & Browser" },
            ].map((benefit, i) => (
              <div key={i} className="bg-zinc-900 border border-white/10 rounded-3xl p-10 text-center hover:border-violet-500/30 transition-all">
                <div className="text-6xl mb-6">{benefit.icon}</div>
                <h3 className="text-2xl font-semibold mb-4">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <div className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 py-24">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-5xl font-bold mb-6">Ready to experience it yourself?</h2>
          <p className="text-xl text-white/90 mb-10">Join thousands of teams already chatting on Pulse</p>
          
          <Link 
            href="/register"
            className="inline-flex items-center gap-3 px-10 py-5 bg-black text-white rounded-2xl text-xl font-semibold hover:scale-105 transition-all"
          >
            Create Your Free Workspace
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </div>
  );
}