"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageCircle, Zap, Shield, Heart, ArrowRight, Users, Globe, Clock } from 'lucide-react';

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
        const increment = end / (duration / 20); // Smoother steps

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
    { icon: <Zap className="w-8 h-8" />, title: "Speed First", desc: "Every message should feel instant.", color: "violet" },
    { icon: <Shield className="w-8 h-8" />, title: "Privacy by Design", desc: "Your conversations are yours.", color: "fuchsia" },
    { icon: <Heart className="w-8 h-8" />, title: "Human Connection", desc: "Technology that brings people closer.", color: "cyan" },
  ];

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-black to-zinc-950">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tighter mb-6">
            We believe in <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">better conversations</span>
          </h1>
          <p className="text-2xl text-gray-400 max-w-2xl mx-auto">
            Pulse was born from frustration with slow, cluttered, and insecure chat tools.
          </p>
        </div>
      </section>

      {/* Story + Mission + Vision */}
      <section className="py-24 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-bold tracking-tight mb-8">Our Story</h2>
              <div className="space-y-6 text-lg text-gray-300">
                <p>Founded in 2024, Pulse started as a side project between three friends tired of using outdated communication tools.</p>
                <p>We wanted a chat experience that was <span className="text-violet-400">blazing fast</span>, beautiful, and truly private.</p>
                <p>Today, Pulse is trusted by over 50,000 users across startups and global communities.</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-zinc-900 border border-white/10 rounded-3xl p-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-4xl">🎯</div>
                  <h3 className="text-3xl font-semibold">Our Mission</h3>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed">
                  To make digital communication feel as natural and delightful as face-to-face conversations.
                </p>
              </div>

              <div className="bg-zinc-900 border border-white/10 rounded-3xl p-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-4xl">🌟</div>
                  <h3 className="text-3xl font-semibold">Our Vision</h3>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed">
                  To become the most loved communication platform where every team feels truly connected.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Values */}
      <section className="py-24 bg-zinc-950">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold tracking-tight mb-4">What drives us</h2>
            <p className="text-xl text-gray-400">Hover or tap on each value</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                onMouseEnter={() => setActiveValue(index)}
                onClick={() => setActiveValue(index)}
                className={`group p-10 rounded-3xl border transition-all duration-500 cursor-pointer ${
                  activeValue === index ? 'border-violet-500 bg-zinc-900 scale-[1.03]' : 'border-white/10 hover:border-white/30'
                }`}
              >
                <div className={`text-${value.color}-400 mb-6 transition-transform group-hover:scale-110 duration-300`}>
                  {value.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-4">{value.title}</h3>
                <p className="text-gray-400 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - Matching Your Image */}
      <section id="stats" className="py-28 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold tracking-tight">By the numbers</h2>
            <p className="text-gray-400 mt-3">Real impact, real growth</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                icon: <Users className="w-9 h-9 text-violet-400" />, 
                number: counters.users, 
                suffix: "+", 
                label: "Happy Users" 
              },
              { 
                icon: <MessageCircle className="w-9 h-9 text-violet-400" />, 
                number: counters.messages, 
                suffix: "+", 
                label: "Messages Sent" 
              },
              { 
                icon: <Globe className="w-9 h-9 text-violet-400" />, 
                number: counters.countries, 
                suffix: "", 
                label: "Countries" 
              },
              { 
                icon: <Clock className="w-9 h-9 text-violet-400" />, 
                number: counters.uptime, 
                suffix: "%", 
                label: "Uptime" 
              },
            ].map((stat, i) => (
              <div 
                key={i} 
                className="bg-zinc-900 rounded-3xl p-10 text-center border border-white/10 hover:border-violet-500/30 transition-all duration-300 hover:scale-105 group"
              >
                <div className="flex justify-center mb-6">
                  {stat.icon}
                </div>
                <div className="text-5xl font-bold tracking-tighter mb-2 text-white">
                  {stat.number.toLocaleString()}{stat.suffix}
                </div>
                <p className="text-gray-400 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold tracking-tight">Meet the team</h2>
            <p className="text-gray-400 mt-4">The people building the future of communication</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Sarah Chen", role: "CEO & Founder", image: "👩🏻‍💼" },
              { name: "Rahul Sharma", role: "CTO", image: "👨🏽‍💻" },
              { name: "Priya Malhotra", role: "Head of Design", image: "👩🏾‍🎨" },
            ].map((member, i) => (
              <div key={i} className="bg-zinc-900 rounded-3xl p-8 text-center hover:scale-105 transition-all duration-300 border border-white/10 hover:border-violet-500/30">
                <div className="text-7xl mb-6">{member.image}</div>
                <h3 className="text-2xl font-semibold">{member.name}</h3>
                <p className="text-violet-400 mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <div className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-5xl font-bold mb-6">Ready to join the conversation?</h2>
          <Link 
            href="/register"
            className="inline-flex items-center gap-3 px-10 py-5 bg-black text-white rounded-2xl text-xl font-semibold hover:scale-105 transition-all"
          >
            Start Your Free Workspace
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </div>
  );
}