"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MessageCircle } from 'lucide-react';
import { FaTwitter, FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa'
import Link from 'next/link'


function page() {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div>
      {/* Footer */}
      <footer className="bg-transparent border-t border-white/10 pt-16 pb-12 relative overflow-hidden font-mono z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,#1e1b4b_0%,transparent_50%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                  <MessageCircle className="w-5 h-5 text-black" />
                </div>
                <h1 className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">Pulse</h1>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Real-time messaging that brings teams closer.
              </p>
            </div>

            {/* Product */}
            <div>
              <h3 className="font-bold tracking-[2px] uppercase text-cyan-400 mb-4 text-xs">Product</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link href="/feature" className="hover:text-white transition-colors">Features</Link></li>
                {/* <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li> */}
                <li><Link href="/integration" className="hover:text-white transition-colors">Integrations</Link></li>
                <li><Link href="/changelog" className="hover:text-white transition-colors">Changelog</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-bold tracking-[2px] uppercase text-cyan-400 mb-4 text-xs">Company</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link href='/' className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/howitworks" className="hover:text-white transition-colors">How it Works</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-bold tracking-[2px] uppercase text-cyan-400 mb-4 text-xs">Resources</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link href="/help" className="hover:text-cyan-300 transition-colors">Help Center</Link></li>
                <li><Link href="/community" className="hover:text-cyan-300 transition-colors">Community</Link></li>
                <li><Link href="/whats-new" className="hover:text-cyan-300 transition-colors">What's New</Link></li>
                <li><Link href="/support" className="hover:text-cyan-300 transition-colors">Support</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-bold tracking-[2px] uppercase text-cyan-400 mb-4 text-xs">Legal</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link href="/privacy" className="hover:text-cyan-300 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-cyan-300 transition-colors">Terms of Service</Link></li>
                <li><Link href="/security" className="hover:text-cyan-300 transition-colors">Security</Link></li>
                <li><Link href="/trust" className="hover:text-cyan-300 transition-colors">Trust & Safety</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm text-gray-500">
              © 2026 Pulse. All rights reserved.
            </p>

            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaLinkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaGithub className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaInstagram className="w-5 h-5" />
              </a>
            </div>

            <p className="text-sm text-gray-500">
              Made with ❤️ for better conversations
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default page;
