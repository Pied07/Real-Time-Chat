"use client";

import React, { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

import Sidebar from "@/components/chat/Sidebar";
import ChatArea from "@/components/chat/ChatArea";
import CreateGroupModal from "@/components/chat/CreateGroupModal";
import GroupInfoModal from "@/components/chat/GroupInfoModal";
import ProfileModal from "@/components/chat/ProfileModal";

export default function ChatPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const hasActiveConversation = Boolean(selectedUser || selectedGroup);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Fetch All Users (for friends, discover, group modals)
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "users"),
      where("uid", "!=", currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userList = snapshot.docs.map((doc) => ({
        ...doc.data(),
        uid: doc.id,
      }));
      setUsers(userList);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Handle Group Update from Modal
  const handleGroupUpdated = (updatedGroup: any) => {
    setSelectedGroup(updatedGroup);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Please login{" "}
        <a href="/login" className="ml-2 text-violet-500 hover:underline">
          here
        </a>
      </div>
    );
  }

  return (
    <div className="h-dvh bg-black text-white flex overflow-hidden">
      {/* Sidebar */}
      <div
        className={`h-full w-full lg:block lg:w-auto ${
          hasActiveConversation ? "hidden" : "block"
        }`}
      >
        <Sidebar
          currentUser={currentUser}
          users={users}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup}
          onCreateGroup={() => setShowCreateGroup(true)}
        />
      </div>

      {/* Chat Area */}
      <div
        className={`h-full min-w-0 flex-1 lg:flex ${
          hasActiveConversation ? "flex" : "hidden"
        }`}
      >
        <ChatArea
          currentUser={currentUser}
          selectedUser={selectedUser}
          selectedGroup={selectedGroup}
          onBack={() => {
            setSelectedUser(null);
            setSelectedGroup(null);
          }}
          onOpenGroupInfo={() => setShowGroupInfo(true)}
          onOpenProfile={() => setShowProfile(true)}
        />
      </div>

      {/* Create Group Modal */}
      {showCreateGroup && (
        <CreateGroupModal
          currentUser={currentUser}
          users={users}
          onClose={() => setShowCreateGroup(false)}
          onGroupCreated={(group) => {
            setSelectedGroup(group);
            setSelectedUser(null);
            setShowCreateGroup(false);
          }}
        />
      )}

      {/* Group Info Modal */}
      {showGroupInfo && selectedGroup && (
        <GroupInfoModal
          currentUser={currentUser}
          group={selectedGroup}
          users={users}
          onClose={() => setShowGroupInfo(false)}
          onGroupUpdated={handleGroupUpdated}
        />
      )}

      {/* Profile Modal (can be implemented similarly) */}
      {showProfile && (
        <ProfileModal
          selectedUser={selectedUser}
          onClose={() => setShowProfile(false)}
        />
      )}
    </div>
  );
}
