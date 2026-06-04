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
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="relative bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-md p-8 m-8">
        {profileUser?.avatar ? (
          <img
            src={profileUser.avatar}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
          />
        ) : (
          <div className="w-20 h-20 rounded-full mx-auto bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-4xl font-bold">
            {profileUser?.name?.[0] || "?"}
          </div>
        )}
        <div className="text-center m-4">
            <span className="text-4xl font-bold">{profileUser?.name}</span>
            <p className="text-gray-400">{profileUser?.email}</p>
        </div>
        <div className="text-center bg-zinc-800 border border-white/10 rounded-2xl p-4">
            <p className="text-gray-400">{profileUser?.bio || "No bio available"}</p>
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-violet-600 hover:text-violet-700 rounded-2xl transition-all"
        >
          <X />
        </button>
      </div>
    </div>
  );
}

export default ProfileModal;
