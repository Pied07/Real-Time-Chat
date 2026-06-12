"use client";

import React, { useState, useEffect } from "react";
import { X, UserPlus, UserCheck, UserRoundX, UserMinus, Edit2 } from "lucide-react";
import Image from "next/image";
import { db } from "@/lib/firebase";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

interface GroupInfoModalProps {
  currentUser: any;
  group: any;
  users: any[];           // Pass all users from parent for "Add Member"
  onClose: () => void;
  onGroupUpdated?: (updatedGroup: any) => void;
}

const MAX_DESCRIPTION_LENGTH = 200;

export default function GroupInfoModal({
  currentUser,
  group,
  users,
  onClose,
  onGroupUpdated,
}: GroupInfoModalProps) {
  const [descriptionDraft, setDescriptionDraft] = useState(group.description || "");
  const [editingDescription, setEditingDescription] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);

  const isAdmin = (group.admins || [group.createdBy]).includes(currentUser.uid);

  const saveDescription = async () => {
    if (!group) return;

    const trimmed = descriptionDraft.trim();
    if (trimmed.length > MAX_DESCRIPTION_LENGTH) {
      alert(`Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters.`);
      return;
    }

    try {
      await updateDoc(doc(db, "groups", group.id), {
        description: trimmed,
      });

      setEditingDescription(false);
      onGroupUpdated?.({ ...group, description: trimmed });
    } catch (error) {
      console.error("Error updating description:", error);
      alert("Failed to update description");
    }
  };

  const promoteToAdmin = async (userId: string) => {
    if (!isAdmin) return;
    try {
      await updateDoc(doc(db, "groups", group.id), {
        admins: arrayUnion(userId),
      });
      onGroupUpdated?.({
        ...group,
        admins: [...(group.admins || []), userId],
      });
    } catch (error) {
      alert("Failed to promote user");
    }
  };

  const demoteFromAdmin = async (userId: string) => {
    if (!isAdmin) return;
    if ((group.admins || []).length <= 1) {
      alert("Cannot remove the last admin");
      return;
    }
    try {
      await updateDoc(doc(db, "groups", group.id), {
        admins: arrayRemove(userId),
      });
      onGroupUpdated?.({
        ...group,
        admins: (group.admins || []).filter((id: string) => id !== userId),
      });
    } catch (error) {
      alert("Failed to demote user");
    }
  };

  const removeMember = async (userId: string) => {
    if (!isAdmin) return;
    try {
      await updateDoc(doc(db, "groups", group.id), {
        members: arrayRemove(userId),
        admins: arrayRemove(userId),
      });
      onGroupUpdated?.({
        ...group,
        members: group.members.filter((id: string) => id !== userId),
        admins: (group.admins || []).filter((id: string) => id !== userId),
      });
    } catch (error) {
      alert("Failed to remove member");
    }
  };

  const addMember = async (userId: string) => {
    if (!isAdmin) return;
    try {
      await updateDoc(doc(db, "groups", group.id), {
        members: arrayUnion(userId),
      });
      onGroupUpdated?.({
        ...group,
        members: [...group.members, userId],
      });
      setShowAddMember(false);
    } catch (error) {
      alert("Failed to add member");
    }
  };

  const availableUsers = users.filter(
    (user) => !group.members.includes(user.uid)
  );

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 font-mono">
      <div className="relative bg-zinc-950/80 border border-cyan-500/30 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col m-8 shadow-[0_0_50px_rgba(34,211,238,0.1)]">
        {/* Header */}
        <div className="flex justify-between items-center p-8 border-b border-white/10 bg-black/50">
          <h2 className="text-3xl font-bold tracking-tighter bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">Group Info</h2>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-4xl text-gray-400 hover:text-white transition-colors"
          >
            <X />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {/* Group Name */}
          <div className="mb-8">
            <p className="text-xs font-bold tracking-[2px] uppercase text-cyan-400/50 mb-2">Group Designation</p>
            <p className="text-3xl font-bold text-white">{group.name}</p>
          </div>

          {/* Description */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
              <p className="text-xs font-bold tracking-[2px] uppercase text-cyan-400/50">Mission Parameters</p>
              {isAdmin && !editingDescription && (
                <button
                  onClick={() => setEditingDescription(true)}
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-xs font-bold tracking-[1px] uppercase transition-colors"
                >
                  <Edit2 size={14} /> Edit Parameters
                </button>
              )}
            </div>

            {editingDescription ? (
              <div className="space-y-4">
                <textarea
                  value={descriptionDraft}
                  onChange={(e) => {
                    if (e.target.value.length <= MAX_DESCRIPTION_LENGTH) {
                      setDescriptionDraft(e.target.value);
                    }
                  }}
                  className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 min-h-[120px] focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.1)] transition-all placeholder:text-zinc-600 text-white"
                />
                <div className="flex justify-between text-xs font-bold tracking-[1px] uppercase">
                  <span className={descriptionDraft.length > 180 ? "text-red-400 animate-pulse" : "text-zinc-500"}>
                    {descriptionDraft.length} / {MAX_DESCRIPTION_LENGTH}
                  </span>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setEditingDescription(false);
                        setDescriptionDraft(group.description || "");
                      }}
                      className="px-6 py-2 bg-black/50 border border-white/10 hover:bg-zinc-900 text-zinc-400 rounded-2xl transition-all"
                    >
                      Abort
                    </button>
                    <button
                      onClick={saveDescription}
                      className="px-6 py-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500 hover:text-black shadow-[0_0_15px_rgba(34,211,238,0.1)] rounded-2xl transition-all"
                    >
                      Commit
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-300 leading-relaxed">
                {group.description || "No description provided."}
              </p>
            )}
          </div>

          {/* Members Section */}
          <div>
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-2">
              <p className="text-xs font-bold tracking-[2px] uppercase text-cyan-400/50">
                Operatives ({group.members.length})
              </p>
              {isAdmin && (
                <button
                  onClick={() => setShowAddMember(true)}
                  className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-xs font-bold tracking-[1px] uppercase transition-colors"
                >
                  <UserPlus size={16} /> Add Operative
                </button>
              )}
            </div>

            <div className="space-y-3">
              {group.members.map((uid: string) => {
                const member = users.find((u) => u.uid === uid) || {
                  uid,
                  name: uid === currentUser.uid ? "You" : "Unknown User",
                  email: "",
                };

                const isCurrentUser = uid === currentUser.uid;
                const isGroupAdmin = (group.admins || [group.createdBy]).includes(uid);

                return (
                  <div
                    key={uid}
                    className="flex items-center justify-between bg-black/30 border border-white/5 hover:border-cyan-400/30 hover:bg-cyan-500/5 p-5 rounded-2xl group transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-zinc-800 to-black border border-white/10 rounded-2xl flex items-center justify-center text-xl font-bold text-zinc-500">
                        {member.name?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-white tracking-tight">{member.name}</p>
                          {isGroupAdmin && (
                            <span className="text-[10px] font-bold tracking-[1px] uppercase px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full border border-cyan-500/30">
                              Admin
                            </span>
                          )}
                          {isCurrentUser && <span className="text-xs text-zinc-500 font-mono">(You)</span>}
                        </div>
                        <p className="text-xs text-zinc-500 font-mono tracking-tight">{member.email}</p>
                      </div>
                    </div>

                    {/* Admin Actions */}
                    {isAdmin && !isCurrentUser && (
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        {!isGroupAdmin ? (
                          <button
                            onClick={() => promoteToAdmin(uid)}
                            className="p-3 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300 rounded-xl transition-colors"
                            title="Promote to Admin"
                          >
                            <UserCheck size={20} />
                          </button>
                        ) : (
                          <button
                            onClick={() => demoteFromAdmin(uid)}
                            className="p-3 text-yellow-400 hover:bg-yellow-500/10 rounded-xl"
                            title="Demote Admin"
                          >
                            <UserRoundX size={20} />
                          </button>
                        )}

                        <button
                          onClick={() => removeMember(uid)}
                          className="p-3 text-red-400 hover:bg-red-500/10 rounded-xl"
                          title="Remove from Group"
                        >
                          <UserMinus size={20} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Add Member Modal (Nested) */}
      {showAddMember && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] font-mono">
          <div className="bg-zinc-950/90 border border-cyan-500/30 rounded-3xl w-full max-w-lg m-8 p-8 shadow-[0_0_50px_rgba(34,211,238,0.1)]">
            <h3 className="text-xl font-bold tracking-[2px] uppercase text-cyan-400 mb-6">Add Operative</h3>

            {availableUsers.length === 0 ? (
              <p className="text-center text-gray-400 py-10">All users are already in this group.</p>
            ) : (
              <div className="max-h-96 overflow-y-auto space-y-2">
                {availableUsers.map((user) => (
                  <button
                    key={user.uid}
                    onClick={() => addMember(user.uid)}
                    className="w-full flex items-center gap-4 p-4 border border-transparent hover:border-cyan-400/30 hover:bg-cyan-500/5 rounded-2xl text-left transition-all"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-zinc-800 to-black border border-white/10 rounded-2xl flex items-center justify-center text-xl font-bold text-zinc-500">
                      {user.name?.[0]}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-white">{user.name}</p>
                      <p className="text-xs text-zinc-500 font-mono tracking-tight">{user.email}</p>
                    </div>
                    <UserPlus className="text-cyan-400" />
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowAddMember(false)}
              className="mt-6 w-full py-4 bg-black/50 border border-white/10 hover:bg-zinc-900 text-zinc-400 rounded-2xl text-xs font-bold tracking-[2px] uppercase transition-all"
            >
              Abort
            </button>
          </div>
        </div>
      )}
    </div>
  );
}