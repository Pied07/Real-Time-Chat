"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { MessageCircle, Eye, EyeOff } from 'lucide-react';

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-3xl flex items-center justify-center">
              <MessageCircle className="w-7 h-7" />
            </div>
            <h1 className="text-4xl font-bold tracking-tighter">Pulse</h1>
          </Link>
        </div>

        <div className="bg-zinc-900 border border-white/10 rounded-3xl p-10">
          <h2 className="text-3xl font-bold text-center mb-2">Create your workspace</h2>
          <p className="text-gray-400 text-center mb-8">Join thousands of teams using Pulse</p>

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full bg-zinc-950 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <input
                type="email"
                placeholder="you@company.com"
                className="w-full bg-zinc-950 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className="w-full bg-zinc-950 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-violet-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-4 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="w-full bg-zinc-950 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-violet-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-5 top-4 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <input type="checkbox" className="w-4 h-4 accent-violet-500" />
              <span className="text-gray-400">
                I agree to the <span className="text-violet-400">Terms</span> and{' '}
                <span className="text-violet-400">Privacy Policy</span>
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 py-4 rounded-2xl font-semibold text-lg hover:scale-105 transition-all active:scale-95"
            >
              Create Free Account
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium">
              Sign in
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-8">
          End-to-end encrypted • SOC 2 Certified
        </p>
      </div>
    </div>
  );
}