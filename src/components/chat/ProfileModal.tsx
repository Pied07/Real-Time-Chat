"use client";

import React, { useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { X } from "lucide-react";

interface ProfileModalProps {
  selectedUser: any;
  onClose: () => void;
}

function ProfileModal({ selectedUser, onClose }: ProfileModalProps) {
  const [profileUser, setProfileUser] = React.useState<any>(null);

  // Fetch All Users (for friends, discover, group modals)
  useEffect(() => {
    if (!selectedUser) return;

    const q = query(
      collection(db, "users"),
      where("uid", "==", selectedUser.uid),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const userData = snapshot.docs[0].data();
        setProfileUser(userData);
      }
    });

    return () => unsubscribe();
  }, [selectedUser]);

  console.log("Profile User:", profileUser);
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 font-mono">
      <div className="relative bg-zinc-950/80 border border-cyan-500/30 rounded-3xl w-full max-w-md p-8 m-8 shadow-[0_0_50px_rgba(34,211,238,0.1)]">
        {profileUser?.avatar ? (
          <img
            src={profileUser.avatar}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
          />
        ) : (
          <div className="w-24 h-24 rounded-full mx-auto bg-gradient-to-br from-zinc-800 to-black border-2 border-cyan-400/30 flex items-center justify-center text-zinc-500 text-4xl font-bold shadow-[0_0_20px_rgba(34,211,238,0.2)]">
            {profileUser?.name?.[0] || "?"}
          </div>
        )}
        <div className="text-center mt-6 mb-6">
            <h2 className="text-3xl font-bold tracking-tighter text-white">{profileUser?.name}</h2>
            <p className="text-cyan-400/70 text-sm mt-1">{profileUser?.email}</p>
        </div>
        <div className="text-center bg-black/50 border border-white/10 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
            <p className="text-xs font-bold tracking-[2px] uppercase text-zinc-500 mb-2">Operator Status</p>
            <p className="text-zinc-300 italic">"{profileUser?.bio || "No status available."}"</p>
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-cyan-400 rounded-2xl transition-all"
        >
          <X />
        </button>
      </div>
    </div>
  );
}

export default ProfileModal;
