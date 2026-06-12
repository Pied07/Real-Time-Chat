"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageCircle, LogOut } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

interface UserProfile {
  avatar?: string;
  name?: string;
  email?: string;
}

function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setProfile(userDoc.data() as UserProfile);
          } else {
            setProfile({
              name: currentUser.displayName || "",
              email: currentUser.email || "",
            });
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setShowDropdown(false);
  };

  const displayName =
    profile?.name || user?.displayName || user?.email?.split("@")[0] || "User";
  const avatarUrl = profile?.avatar || user?.photoURL;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-3xl border-b border-white/10">
      {/* Subtle top scan line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between relative">
        {/* Logo - Futuristic */}
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ rotate: 12, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-10 h-10 bg-gradient-to-br from-cyan-400 via-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-lg shadow-cyan-500/30"
          >
            <MessageCircle className="w-6 h-6 text-black" />
            {/* Inner glow ring */}
            <div className="absolute inset-0 border border-white/30 rounded-2xl" />
          </motion.div>
          
          <div className="flex flex-col -space-y-1">
            <h1 className="text-3xl font-bold tracking-[-2px] bg-gradient-to-r from-white via-cyan-200 to-violet-300 bg-clip-text text-transparent">
              PULSE
            </h1>
            <span className="text-[10px] text-cyan-400/70 tracking-[3px] font-mono">NEURAL v0.3026</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-10 text-sm font-medium">
          {[
            { label: "HOME", href: "/" },
            { label: "ABOUT", href: "/about" },
            { label: "HOW IT WORKS", href: "/howitworks" },
            { label: "BLOG", href: "/blog" },
            { label: "CONTACT", href: "/contact" },
          ].map((link, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href={link.href}
                className="relative px-4 py-2 text-zinc-400 hover:text-white transition-colors group"
              >
                {link.label}
                <span className="absolute bottom-1.5 left-4 h-px w-0 bg-gradient-to-r from-cyan-400 to-fuchsia-400 group-hover:w-[calc(100%-32px)] transition-all" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* User Section */}
        <div className="flex items-center gap-4">
          {user ? (
            <div
              className="relative"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <motion.div
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDropdown((prev) => !prev)}
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-cyan-400/30 hover:border-cyan-400 cursor-pointer transition-all duration-300 relative"
              >
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={displayName}
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center font-bold text-xl border border-white/20">
                    <span className="text-white select-none drop-shadow-md">{initial}</span>
                  </div>
                )}
                
                {/* Status ring */}
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-400 rounded-full border-[2.5px] border-black" />
              </motion.div>

              {/* Futuristic Dropdown */}
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-64 bg-zinc-950/95 border border-white/10 backdrop-blur-3xl rounded-3xl shadow-2xl overflow-hidden py-2 z-50"
                  >
                    <div className="px-6 py-5 border-b border-white/10">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/20">
                          {avatarUrl ? (
                            <Image src={avatarUrl} alt="" width={56} height={56} className="object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-3xl">
                              {initial}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-lg">{displayName}</p>
                          <p className="text-sm text-zinc-400 truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="py-2">
                      <Link
                        href="/profile"
                        className="block px-6 py-3 hover:bg-white/5 transition-colors text-sm"
                      >
                        View Neural Profile
                      </Link>
                      <Link
                        href="/chat"
                        className="block px-6 py-3 hover:bg-white/5 transition-colors text-sm"
                      >
                        Enter Chat Grid
                      </Link>
                    </div>

                    <div className="border-t border-white/10 pt-2 mt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-6 py-3 hover:bg-red-500/10 transition-colors text-red-400 flex items-center gap-3 text-sm"
                      >
                        <LogOut className="w-4 h-4" />
                        Disconnect from Grid
                      </button>
                    </div>

                    {/* Corner holographic accents */}
                    <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-cyan-400/30" />
                    <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-cyan-400/30" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="px-7 py-2.5 text-sm font-medium text-zinc-400 hover:text-white rounded-full transition-all hover:bg-white/5"
              >
                LOG IN
              </Link>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/register"
                  className="px-7 py-2.5 bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 text-black font-semibold rounded-full hover:shadow-xl hover:shadow-cyan-400/40 transition-all text-sm"
                >
                  INITIALIZE ACCESS
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;