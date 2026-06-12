"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Zap, Shield, Globe, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const tiers = [
  {
    name: 'BASIC NODE',
    price: '0',
    description: 'Perfect for small teams syncing up to 10 minds.',
    features: [
      '10 Neural Connections',
      'Quantum Encryption (Standard)',
      '10,000 Messages / month',
      'Community Support'
    ],
    buttonText: 'INITIALIZE FREE',
    popular: false,
    color: 'cyan'
  },
  {
    name: 'QUANTUM GRID',
    price: '49',
    description: 'Advanced features for scaling dimensions.',
    features: [
      'Unlimited Neural Connections',
      'Quantum Encryption (Military-grade)',
      'Unlimited Messages',
      'Priority Architect Support',
      'Custom Dimensional Themes',
      'API Access'
    ],
    buttonText: 'UPGRADE NODE',
    popular: true,
    color: 'violet'
  },
  {
    name: 'OMNIVERSE',
    price: '199',
    description: 'Enterprise control for global super-clusters.',
    features: [
      'Everything in Quantum Grid',
      'Dedicated Quantum Node',
      '24/7 Architect Sync',
      'Custom Integrations',
      'SLA 99.999% Uptime',
      'On-premise Deployment Option'
    ],
    buttonText: 'CONTACT ARCHITECTS',
    popular: false,
    color: 'fuchsia'
  }
];

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="min-h-screen bg-transparent text-white font-mono pt-32 overflow-hidden">
      <section className="pb-20 px-6 relative">
        <div className="absolute inset-0 bg-[radial-gradient(at_50%_0%,#8b5cf630_0%,transparent_50%)]" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex px-6 py-2 border border-violet-400/30 bg-violet-400/5 rounded-full mb-8 text-xs tracking-[4px] text-violet-300"
          >
            RESOURCE ALLOCATION
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-[80px] font-bold tracking-[-4px] leading-[1] mb-8 bg-gradient-to-br from-white via-violet-200 to-cyan-300 bg-clip-text text-transparent"
          >
            SELECT DIMENSION
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-zinc-400 max-w-2xl mx-auto font-light tracking-[-0.5px] mb-12"
          >
            Simple, transparent pricing for teams building the future.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-4"
          >
            <span className={`text-sm tracking-[2px] uppercase ${billingCycle === 'monthly' ? 'text-white font-bold' : 'text-zinc-500'}`}>Monthly</span>
            <button 
              onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
              className="w-16 h-8 bg-zinc-800 rounded-full relative border border-white/10 p-1 flex items-center transition-colors"
            >
              <motion.div 
                layout
                className="w-6 h-6 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                style={{ marginLeft: billingCycle === 'yearly' ? 'auto' : '0' }}
              />
            </button>
            <span className={`text-sm tracking-[2px] uppercase ${billingCycle === 'yearly' ? 'text-white font-bold' : 'text-zinc-500'}`}>
              Annually <span className="text-emerald-400 text-xs ml-2">SAVE 20%</span>
            </span>
          </motion.div>
        </div>
      </section>

      <section className="py-12 relative z-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            {tiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative group bg-zinc-950/60 backdrop-blur-xl border ${tier.popular ? `border-${tier.color}-500 shadow-[0_0_40px_rgba(139,92,246,0.2)] scale-105` : 'border-white/10'} rounded-3xl p-10 hover:border-${tier.color}-400/50 transition-all duration-300`}
              >
                {tier.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-bold tracking-[2px] uppercase py-1 px-4 rounded-full">
                    Recommended
                  </div>
                )}
                <h3 className={`text-xl font-bold tracking-[2px] uppercase text-${tier.color}-400 mb-2`}>{tier.name}</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-bold tracking-tighter">
                    ${billingCycle === 'yearly' && tier.price !== '0' ? Math.floor(parseInt(tier.price) * 0.8) : tier.price}
                  </span>
                  <span className="text-zinc-500 text-sm tracking-[1px] uppercase">/ node / mo</span>
                </div>
                <p className="text-zinc-400 font-light mb-8 h-12">{tier.description}</p>
                
                <Link
                  href={tier.price === '0' ? '/register' : '/contact'}
                  className={`w-full block text-center py-4 rounded-2xl font-bold tracking-[2px] uppercase mb-8 transition-all duration-300 ${
                    tier.popular 
                      ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:shadow-[0_0_30px_rgba(139,92,246,0.4)]' 
                      : 'bg-white/5 border border-white/10 hover:bg-white/10 text-white'
                  }`}
                >
                  {tier.buttonText}
                </Link>

                <div className="space-y-4">
                  {tier.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle className={`w-5 h-5 text-${tier.color}-400 shrink-0 mt-0.5`} />
                      <span className="text-zinc-300 text-sm font-light leading-relaxed">{feat}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center border-t border-white/10 pt-20">
          <h2 className="text-4xl font-bold tracking-tight mb-6">Need a custom dimension?</h2>
          <p className="text-xl text-zinc-400 font-light mb-10">Our architects can design a tailored neural network for your organization.</p>
          <Link href="/contact" className="inline-flex items-center gap-3 text-cyan-400 font-bold tracking-[2px] uppercase hover:text-cyan-300 transition-colors">
            CONTACT ARCHITECTS <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
