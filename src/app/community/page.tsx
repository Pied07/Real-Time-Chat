import React from "react";
import Navbar from "@/components/navbar/page";
import Footer from "@/components/footer/page";
import { Users } from "lucide-react";

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-transparent text-white font-mono selection:bg-cyan-500/30">
      <Navbar />
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-[2px] mb-6">
          <Users className="w-4 h-4" /> Node Network
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
          COMMUNITY
        </h1>
        <p className="text-zinc-400 max-w-2xl mx-auto text-lg mb-12">
          Join the collective. Connect with other operators and cryptographers in the neural matrix.
        </p>
        <div className="h-64 flex items-center justify-center border border-white/10 rounded-3xl bg-zinc-900/50 backdrop-blur-xl">
            <span className="text-cyan-400 animate-pulse">Scanning for active nodes...</span>
        </div>
      </div>
      <Footer />
    </div>
  );
}
