"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MessageCircle, Eye, EyeOff } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import {
  decryptPrivateKeyWithPassword,
  encryptPrivateKeyWithPassword,
} from "@/lib/EncryptDecrypt";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
          return;
        }
      }

      router.push("/chat");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
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
          <h2 className="text-3xl font-bold text-center mb-2">Welcome back</h2>
          <p className="text-gray-400 text-center mb-8">
            Sign in to continue to your workspace
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full bg-zinc-950 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-violet-400 hover:text-violet-300"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 py-4 rounded-2xl font-semibold text-lg hover:scale-105 transition-all active:scale-95"
            >
              Sign In
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-violet-400 hover:text-violet-300 font-medium"
            >
              Create one free
            </Link>
          </div>

          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10"></div>
            <span className="text-gray-500 text-sm">OR</span>
            <div className="h-px flex-1 bg-white/10"></div>
          </div>

          <button className="w-full border border-white/10 hover:bg-white/5 py-4 rounded-2xl flex items-center justify-center gap-3 transition-colors">
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>
        </div>

        <p className="text-center text-xs text-gray-500 mt-8">
          © 2026 Pulse. Secure and encrypted.
        </p>
      </div>
    </div>
  );
}
