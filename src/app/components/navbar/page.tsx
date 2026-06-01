"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { MessageCircle} from 'lucide-react';


function page() {
  const [showDropdown, setShowDropdown] = useState(false);
  return (
    <div>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tighter">Pulse</h1>
          </div>

          <div className="hidden md:flex items-center gap-10 text-sm font-medium">
            <a href="#features" className="hover:text-violet-400 transition-colors">Features</a>
            <a href="#how" className="hover:text-violet-400 transition-colors">How it Works</a>
            <a href="#pricing" className="hover:text-violet-400 transition-colors">Pricing</a>
            <a href="#" className="hover:text-violet-400 transition-colors">Blog</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" style={{ transition: "0.5s ease" }} className="px-6 py-2.5 text-sm font-medium hover:bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full transition-all active:scale-95">
              Log in
            </Link>
            <Link href="/register" className="px-6 py-2.5 bg-white text-black font-semibold rounded-full hover:bg-gradient-to-br from-violet-500 to-fuchsia-500 hover:text-white transition-all active:scale-95">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default page;
