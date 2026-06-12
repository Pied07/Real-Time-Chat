"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MessageCircle, Eye, EyeOff } from "lucide-react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { motion } from "framer-motion";
import {
  encryptPrivateKeyWithPassword,
  generateKeyPair,
} from "@/lib/EncryptDecrypt";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Decryption keys do not match. Please verify.");
      return;
    }

    if (!name.trim()) {
      alert("Please enter your designated alias");
      return;
    }

    setLoading(true);

    try {
      const { publicKey, privateKey } = await generateKeyPair();
      const encryptedPrivateKey = await encryptPrivateKeyWithPassword(
        privateKey,
        password,
      );

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name.trim(),
        email: user.email,
        avatar: "",
        bio: "",
        isOnline: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),

        // 🔐 E2EE
        publicKey, // ✅ STORE PUBLIC KEY

        // 🔥 Friend System
        encryptedPrivateKey,
        friends: [],
        incomingRequests: [],
        outgoingRequests: [],
      });

      sessionStorage.setItem("privateKey", privateKey);

      alert("Node instantiated successfully. Welcome to the grid.");
      router.push("/chat");
    } catch (error: any) {
      console.error(error);
      alert(error.message || "System error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white font-mono flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#06b6d420_0%,transparent_50%)] z-0 pointer-events-none" />

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
              className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.3)] relative overflow-hidden"
            >
              <div className="absolute inset-0 border-2 border-white/20 rounded-2xl" />
              <MessageCircle className="w-8 h-8 text-black" />
            </motion.div>
            <h1 className="text-5xl font-bold tracking-tighter bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">Pulse</h1>
          </Link>
        </div>

        <div className="bg-zinc-950/80 backdrop-blur-3xl border border-white/10 rounded-3xl p-10 relative overflow-hidden shadow-2xl">
          {/* Holographic scanning line */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-[scan_3s_linear_infinite]" />

          <h2 className="text-3xl font-bold text-center tracking-tight mb-2">Initialize Node</h2>
          <p className="text-zinc-500 text-center mb-8 uppercase tracking-[2px] text-xs font-semibold">
            Join the 3026 grid
          </p>

          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold tracking-[2px] uppercase text-zinc-400 mb-2">
                Designated Alias
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Neo"
                className="w-full bg-black/60 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all font-mono placeholder:text-zinc-700"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-[2px] uppercase text-zinc-400 mb-2">
                Node Address (Email)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="neo@matrix.grid"
                className="w-full bg-black/60 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all font-mono placeholder:text-zinc-700"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-[2px] uppercase text-zinc-400 mb-2">Decryption Key</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create strong key"
                  className="w-full bg-black/60 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all font-mono placeholder:text-zinc-700"
                  required
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

            <div>
              <label className="block text-xs font-semibold tracking-[2px] uppercase text-zinc-400 mb-2">
                Confirm Key
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Verify your key"
                  className="w-full bg-black/60 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all font-mono placeholder:text-zinc-700"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-5 top-4 text-zinc-500 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                className="w-4 h-4 accent-cyan-400 mt-1"
                required
              />
              <span className="text-zinc-400 font-light text-xs leading-relaxed">
                I agree to the <Link href="/terms" className="text-cyan-400 hover:text-cyan-300 font-semibold uppercase tracking-[1px]">Terms</Link>{" "}
                and <Link href="/privacy" className="text-cyan-400 hover:text-cyan-300 font-semibold uppercase tracking-[1px]">Privacy Policy</Link>
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 py-4 rounded-2xl font-bold tracking-[2px] uppercase text-black text-lg hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all disabled:opacity-50"
            >
              {loading ? "Generating Keys..." : "Instantiate Node"}
            </motion.button>
          </form>

          <div className="mt-8 text-center text-sm text-zinc-400">
            <span className="font-light">Existing node? </span>
            <Link
              href="/login"
              className="text-cyan-400 hover:text-cyan-300 font-bold uppercase tracking-[1px] ml-2"
            >
              Authenticate
            </Link>
          </div>

          {/* Corner accents */}
          <div className="absolute top-4 right-4 w-3 h-3 border-t-2 border-r-2 border-cyan-500/50" />
          <div className="absolute bottom-4 left-4 w-3 h-3 border-b-2 border-l-2 border-cyan-500/50" />
        </div>

        <p className="text-center text-[10px] uppercase tracking-[3px] text-zinc-600 mt-8 font-bold flex justify-center items-center gap-2">
          <ShieldIcon className="w-4 h-4" /> QUANTUM SECURE • E2EE ACTIVE
        </p>
      </motion.div>
    </div>
  );
}

function ShieldIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    </svg>
  );
}
