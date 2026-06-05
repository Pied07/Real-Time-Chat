"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageCircle, LogOut } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

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

  const displayName = profile?.name || user?.displayName || user?.email?.split("@")[0] || "User";
  const avatarUrl = profile?.avatar || user?.photoURL;
  const initial = displayName.charAt(0).toUpperCase();

  return (
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
          <Link href="/about" className="hover:text-violet-400 transition-colors">
            About Us
          </Link>
          <Link href="/howitworks" className="hover:text-violet-400 transition-colors">
            How it Works
          </Link>
          <Link href="/blog" className="hover:text-violet-400 transition-colors">
            Blog
          </Link>
          <Link href="/contact" className="hover:text-violet-400 transition-colors">
            Contact Us
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div
              className="relative"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
              onClick={() => setShowDropdown((prev) => !prev)}
            >
              {/* Avatar Display */}
              <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 cursor-pointer">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={displayName}
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center font-semibold text-lg">
                    <span className="text-white select-none">{initial}</span>
                  </div>
                )}
              </div>

              {/* Dropdown */}
              {showDropdown && (
                <div className="absolute right-0 w-56 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-1 z-50">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="font-medium">{displayName}</p>
                    <p className="text-sm text-gray-400 truncate">{user.email}</p>
                  </div>

                  <Link
                    href="/profile"
                    className="block px-4 py-3 hover:bg-white/5 transition-colors"
                  >
                    View Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors text-red-400 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="px-6 py-2.5 text-sm font-medium hover:bg-white/5 rounded-full transition-all"
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
  );
}

export default Navbar;