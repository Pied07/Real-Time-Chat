"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";

function page() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setShowDropdown(false);
  };
  return (
    <div>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold tracking-tighter">Pulse</h1>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-10 text-sm font-medium">
            <Link href="/" className="hover:text-violet-400 transition-colors">
              Home
            </Link>
            <Link
              href="/about"
              className="hover:text-violet-400 transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/howitworks"
              className="hover:text-violet-400 transition-colors"
            >
              How it Works
            </Link>
            <Link
              href="/blog"
              className="hover:text-violet-400 transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className="hover:text-violet-400 transition-colors"
            >
              Contact Us
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div
                className="relative"
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center font-semibold cursor-pointer">
                  {(
                    user.displayName?.charAt(0) ||
                    user.email?.charAt(0) ||
                    "U"
                  ).toUpperCase()}
                </div>

                {showDropdown && (
                  <div className="absolute right-0 w-48 bg-zinc-900 border border-white/10 rounded-xl shadow-xl overflow-hidden">
                    <Link
                      href="/profile"
                      className="block px-4 py-3 hover:bg-zinc-800 transition-colors"
                    >
                      Profile
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 hover:bg-zinc-800 transition-colors text-red-400"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-6 py-2.5 text-sm font-medium hover:bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full transition-all"
                >
                  Log in
                </Link>

                <Link
                  href="/register"
                  className="px-6 py-2.5 bg-white text-black font-semibold rounded-full hover:bg-gradient-to-br from-violet-500 to-fuchsia-500 hover:text-white transition-all"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default page;
