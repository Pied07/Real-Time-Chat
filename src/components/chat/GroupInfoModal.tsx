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
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-8 border-b border-white/10">
          <h2 className="text-3xl font-bold">Group Info</h2>
          <button
            onClick={onClose}
            className="text-4xl text-gray-400 hover:text-white transition-colors"
          >
            <X />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {/* Group Name */}
          <div className="mb-8">
            <p className="text-sm text-gray-400 mb-1">GROUP NAME</p>
            <p className="text-2xl font-semibold">{group.name}</p>
          </div>

          {/* Description */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-400">DESCRIPTION</p>
              {isAdmin && !editingDescription && (
                <button
                  onClick={() => setEditingDescription(true)}
                  className="text-violet-400 hover:text-violet-300 flex items-center gap-1 text-sm"
                >
                  <Edit2 size={16} /> Edit
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
                  className="w-full bg-zinc-800 border border-white/10 rounded-2xl px-5 py-4 min-h-[120px] focus:outline-none focus:border-violet-500"
                />
                <div className="flex justify-between text-sm">
                  <span className={descriptionDraft.length > 180 ? "text-orange-400" : "text-gray-500"}>
                    {descriptionDraft.length} / {MAX_DESCRIPTION_LENGTH}
                  </span>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setEditingDescription(false);
                        setDescriptionDraft(group.description || "");
                      }}
                      className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-2xl"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveDescription}
                      className="px-6 py-2 bg-violet-600 hover:bg-violet-700 rounded-2xl"
                    >
                      Save
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
            <div className="flex justify-between items-center mb-6">
              <p className="font-semibold text-lg">
                Members ({group.members.length})
              </p>
              {isAdmin && (
                <button
                  onClick={() => setShowAddMember(true)}
                  className="flex items-center gap-2 text-violet-400 hover:text-violet-300 text-sm"
                >
                  <UserPlus size={18} /> Add Member
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
                    className="flex items-center justify-between bg-zinc-800/50 hover:bg-zinc-800 p-5 rounded-2xl group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-zinc-700 rounded-2xl flex items-center justify-center text-xl font-semibold">
                        {member.name?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{member.name}</p>
                          {isGroupAdmin && (
                            <span className="text-xs px-3 py-1 bg-violet-500/20 text-violet-400 rounded-full border border-violet-500/30">
                              Admin
                            </span>
                          )}
                          {isCurrentUser && <span className="text-xs text-gray-500">(You)</span>}
                        </div>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                    </div>

                    {/* Admin Actions */}
                    {isAdmin && !isCurrentUser && (
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        {!isGroupAdmin ? (
                          <button
                            onClick={() => promoteToAdmin(uid)}
                            className="p-3 text-violet-400 hover:bg-violet-500/10 rounded-xl"
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
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60]">
          <div className="bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-lg p-8">
            <h3 className="text-2xl font-bold mb-6">Add Member</h3>

            {availableUsers.length === 0 ? (
              <p className="text-center text-gray-400 py-10">All users are already in this group.</p>
            ) : (
              <div className="max-h-96 overflow-y-auto space-y-2">
                {availableUsers.map((user) => (
                  <button
                    key={user.uid}
                    onClick={() => addMember(user.uid)}
                    className="w-full flex items-center gap-4 p-5 hover:bg-white/5 rounded-2xl text-left"
                  >
                    <div className="w-12 h-12 bg-zinc-700 rounded-2xl flex items-center justify-center text-xl">
                      {user.name?.[0]}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <UserPlus className="text-violet-400" />
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowAddMember(false)}
              className="mt-6 w-full py-4 bg-zinc-800 hover:bg-zinc-700 rounded-2xl"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}