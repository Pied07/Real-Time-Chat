"use client";

import React, { useState } from "react";
import { X, UserPlus } from "lucide-react";
import { db } from "../../lib/firebase";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import Image from "next/image";

interface CreateGroupModalProps {
  currentUser: any;
  users: any[]; // Pass users from parent or fetch inside
  onClose: () => void;
  onGroupCreated: (group: any) => void;
}

export default function CreateGroupModal({ currentUser, users, onClose, onGroupCreated }: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const createGroup = async () => {
    if (!groupName.trim()) return;

    try {
      const groupData = {
        name: groupName.trim(),
        description: groupDescription.trim(),
        members: [currentUser.uid, ...selectedMembers],
        admins: [currentUser.uid],
        createdBy: currentUser.uid,
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(db, "groups"), groupData);
      await setDoc(doc(db, "chats", docRef.id), { type: "group", name: groupName.trim() });

      onGroupCreated({ id: docRef.id, ...groupData });
    } catch (error) {
      console.error(error);
      alert("Failed to create group");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 font-mono">
      <div className="relative bg-zinc-950/80 border border-cyan-500/30 rounded-3xl w-full max-w-lg p-8 m-8 h-full max-h-[90vh] overflow-hidden flex flex-col shadow-[0_0_50px_rgba(34,211,238,0.1)]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl lg:text-xl font-bold tracking-[2px] uppercase text-cyan-400">Initialize Group</h2>
          <button onClick={onClose} className="absolute top-4 right-4 text-3xl text-zinc-500 hover:text-cyan-400 transition-colors">
            <X />
          </button>
        </div>

        <input
          type="text"
          placeholder="Group Designation..."
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 mb-4 h-12 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.1)] transition-all placeholder:text-zinc-600 text-white"
        />

        <textarea
          placeholder="Mission parameters (optional)..."
          value={groupDescription}
          onChange={(e) => setGroupDescription(e.target.value)}
          className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 mb-6 h-16 resize-none lg:h-24 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.1)] transition-all placeholder:text-zinc-600 text-white"
        />

        <p className="text-xs font-bold tracking-[1px] uppercase text-zinc-500 mb-3">Select Operatives</p>
        <div className="max-h-80 overflow-y-auto space-y-2 pr-2 scrollbar-hide">
          {users
            .filter((u) => u.uid !== currentUser.uid)
            .map((user) => (
              <div
                key={user.uid}
                onClick={() =>
                  setSelectedMembers((prev) =>
                    prev.includes(user.uid) ? prev.filter((id) => id !== user.uid) : [...prev, user.uid]
                  )
                }
                className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border ${
                  selectedMembers.includes(user.uid) ? "bg-cyan-500/10 border-cyan-400 shadow-[inset_0_0_15px_rgba(34,211,238,0.1)]" : "border-transparent hover:bg-white/5 hover:border-white/10"
                }`}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-zinc-800 to-black border border-white/10 rounded-2xl flex items-center justify-center text-xl text-zinc-500">
                  {user.name?.[0]}
                </div>
                <div>
                  <p className="text-white font-bold">{user.name}</p>
                  <p className="text-xs text-zinc-500 font-mono tracking-tight">{user.email}</p>
                </div>
              </div>
            ))}
        </div>

        <div className="flex gap-4 mt-6">
          <button onClick={onClose} className="flex-1 py-4 bg-black/50 border border-white/10 hover:bg-zinc-900 text-zinc-400 rounded-2xl text-xs font-bold tracking-[2px] uppercase transition-all">
            Abort
          </button>
          <button
            onClick={createGroup}
            disabled={!groupName.trim()}
            className="flex-1 py-4 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500 hover:text-black rounded-2xl text-xs font-bold tracking-[2px] uppercase transition-all disabled:opacity-30 disabled:hover:bg-cyan-500/10 disabled:hover:text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.1)]"
          >
            Execute
          </button>
        </div>
      </div>
    </div>
  );
}