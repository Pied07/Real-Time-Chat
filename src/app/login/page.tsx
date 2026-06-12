"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MessageCircle, Eye, EyeOff } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  decryptPrivateKeyWithPassword,
  encryptPrivateKeyWithPassword,
} from "@/lib/EncryptDecrypt";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const userRef = doc(db, "users", userCredential.user.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();

      if (userData?.encryptedPrivateKey) {
        const privateKey = await decryptPrivateKeyWithPassword(
          userData.encryptedPrivateKey,
          password,
        );
        sessionStorage.setItem("privateKey", privateKey);
      } else {
        const existingPrivateKey = localStorage.getItem("privateKey");

        if (existingPrivateKey) {
          const encryptedPrivateKey = await encryptPrivateKeyWithPassword(
            existingPrivateKey,
            password,
          );
          await updateDoc(userRef, { encryptedPrivateKey });
          sessionStorage.setItem("privateKey", existingPrivateKey);
          localStorage.removeItem("privateKey");
        } else {
          alert(
            "Your account does not have a synced encrypted private key yet. Please sign in once on the original device first.",
          );
          setLoading(false);
          return;
        }
      }

      router.push("/chat");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white font-mono flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#7c3aed20_0%,transparent_50%)] z-0 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
              className="w-14 h-14 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.3)] relative overflow-hidden"
            >
              <div className="absolute inset-0 border-2 border-white/20 rounded-2xl" />
              <MessageCircle className="w-8 h-8 text-black" />
            </motion.div>
            <h1 className="text-5xl font-bold tracking-tighter bg-gradient-to-r from-white to-violet-300 bg-clip-text text-transparent">Pulse</h1>
          </Link>
        </div>

        <div className="bg-zinc-950/80 backdrop-blur-3xl border border-white/10 rounded-3xl p-10 relative overflow-hidden shadow-2xl">
          {/* Holographic scanning line */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-violet-400 to-transparent animate-[scan_3s_linear_infinite]" />

          <h2 className="text-3xl font-bold text-center tracking-tight mb-2">Neural Access</h2>
          <p className="text-zinc-500 text-center mb-8 uppercase tracking-[2px] text-xs font-semibold">
            Authenticate to sync
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold tracking-[2px] uppercase text-zinc-400 mb-2">
                Node Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="identity@grid.com"
                className="w-full bg-black/60 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-violet-500 focus:shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-[2px] uppercase text-zinc-400 mb-2">Decryption Key</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-black/60 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-violet-500 focus:shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-4 text-zinc-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-xs tracking-[1px] text-violet-400 hover:text-fuchsia-300 transition-colors uppercase font-semibold"
              >
                Reset Access?
              </Link>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 py-4 rounded-2xl font-bold tracking-[2px] uppercase text-black text-lg hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all disabled:opacity-50"
            >
              {loading ? "Decrypting..." : "Initialize Link"}
            </motion.button>
          </form>

          <div className="mt-8 text-center text-sm text-zinc-400">
            <span className="font-light">Unregistered node? </span>
            <Link
              href="/register"
              className="text-violet-400 hover:text-violet-300 font-bold uppercase tracking-[1px] ml-2"
            >
              Create Identity
            </Link>
          </div>

          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10"></div>
            <span className="text-zinc-600 text-xs font-bold tracking-[2px] uppercase">Or Bypass With</span>
            <div className="h-px flex-1 bg-white/10"></div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full border border-white/10 bg-white/5 hover:bg-white/10 py-4 rounded-2xl flex items-center justify-center gap-3 transition-colors font-semibold tracking-[1px] text-sm uppercase"
          >
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              className="w-5 h-5"
            />
            Google Identity Protocol
          </motion.button>
          
          {/* Corner accents */}
          <div className="absolute top-4 right-4 w-3 h-3 border-t-2 border-r-2 border-violet-500/50" />
          <div className="absolute bottom-4 left-4 w-3 h-3 border-b-2 border-l-2 border-violet-500/50" />
        </div>

        <p className="text-center text-[10px] uppercase tracking-[3px] text-zinc-600 mt-8 font-bold">
          QUANTUM SECURE • E2EE ACTIVE
        </p>
      </motion.div>
    </div>
  );
}
