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
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create New Group</h2>
          <button onClick={onClose} className="text-3xl text-gray-400 hover:text-white">
            <X />
          </button>
        </div>

        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full bg-zinc-800 border border-white/10 rounded-2xl px-5 py-4 mb-4"
        />

        <textarea
          placeholder="Description (optional)"
          value={groupDescription}
          onChange={(e) => setGroupDescription(e.target.value)}
          className="w-full bg-zinc-800 border border-white/10 rounded-2xl px-5 py-4 mb-6 h-24"
        />

        <p className="text-sm text-gray-400 mb-3">Select Members</p>
        <div className="max-h-80 overflow-y-auto space-y-2">
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
                className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${
                  selectedMembers.includes(user.uid) ? "bg-violet-600/20 border border-violet-500" : "hover:bg-white/5"
                }`}
              >
                <div className="w-12 h-12 bg-zinc-700 rounded-2xl flex items-center justify-center text-xl">
                  {user.name?.[0]}
                </div>
                <div>
                  <p>{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
            ))}
        </div>

        <div className="flex gap-4 mt-8">
          <button onClick={onClose} className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 rounded-2xl">
            Cancel
          </button>
          <button
            onClick={createGroup}
            disabled={!groupName.trim()}
            className="flex-1 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl font-semibold disabled:opacity-50"
          >
            Create Group
          </button>
        </div>
      </div>
    </div>
  );
}