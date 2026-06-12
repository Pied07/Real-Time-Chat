"use client";

import React, { useState, useEffect } from "react";
// 1. UPDATED IMPORT: pull rtdb straight out of your config module
import { auth, db as firestoreDb, rtdb } from "@/lib/firebase"; 
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import {
  ref,
  onValue,
  set,
  onDisconnect,
  serverTimestamp,
} from "firebase/database";

import Sidebar from "@/components/chat/Sidebar";
import ChatArea from "@/components/chat/ChatArea";
import CreateGroupModal from "@/components/chat/CreateGroupModal";
import GroupInfoModal from "@/components/chat/GroupInfoModal";
import ProfileModal from "@/components/chat/ProfileModal";

export default function ChatPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [presenceStatuses, setPresenceStatuses] = useState<{ [key: string]: any }>({});
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const hasActiveConversation = Boolean(selectedUser || selectedGroup);

  // 2. DELETED: "const rtdb = getDatabase();" has been safely removed from here!

  // 1. Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // 2. Manage Current User's Presence (Broadcast Active Status & Queue Drop Handler)
  useEffect(() => {
    if (!currentUser) return;

    const connectedRef = ref(rtdb, ".info/connected");
    const myPresenceRef = ref(rtdb, `presence/${currentUser.uid}`);

    const unsubscribe = onValue(connectedRef, async (snap) => {
      if (snap.val() === true) {
        try {
          // Setup the disconnect handler first
          const disconnectHandler = onDisconnect(myPresenceRef);
          await disconnectHandler.set({
            isOnline: false,
            lastChanged: serverTimestamp(),
          });

          // Declare online state directly after
          await set(myPresenceRef, {
            isOnline: true,
            lastChanged: serverTimestamp(),
          });
        } catch (err) {
          console.error("Presence status write failed:", err);
        }
      }
    });

    return () => {
      unsubscribe();
      set(myPresenceRef, {
        isOnline: false,
        lastChanged: serverTimestamp(),
      });
    };
  }, [currentUser]);

  // 3. Fetch All Users from Firestore
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(firestoreDb, "users"),
      where("uid", "!=", currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userList = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          uid: data.uid || doc.id,
        };
      });
      setUsers(userList);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // 4. Real-time Status Sync from Realtime Database
  useEffect(() => {
    const presenceRef = ref(rtdb, "presence");

    const unsubscribe = onValue(presenceRef, (snapshot) => {
      if (snapshot.exists()) {
        setPresenceStatuses(snapshot.val());
      } else {
        setPresenceStatuses({});
      }
    });
    return () => unsubscribe();
  }, []);

  // 5. Combine Firestore User Data with Realtime Presence Data
  const usersWithPresence = users.map((user) => ({
    ...user,
    isOnline: presenceStatuses[user.uid]?.isOnline || false,
    lastChanged: presenceStatuses[user.uid]?.lastChanged || null,
  }));

  // Match the selection accurately back to our dynamic array structure 
  const activeSelectedUser = selectedUser
    ? usersWithPresence.find((u) => u.uid === selectedUser.uid) || selectedUser
    : null;

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
    <div className="h-dvh bg-transparent text-white flex overflow-hidden font-mono relative">
      {/* Sidebar */}
      <div
        className={`h-full w-full lg:block lg:w-auto ${
          hasActiveConversation ? "hidden" : "block"
        }`}
      >
        <Sidebar
          currentUser={currentUser}
          users={usersWithPresence} 
          selectedUser={activeSelectedUser}
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
          selectedUser={activeSelectedUser}
          selectedGroup={selectedGroup}
          onBack={() => {
            setSelectedUser(null);
            setSelectedGroup(null);
          }}
          onOpenGroupInfo={() => setShowGroupInfo(true)}
          onOpenProfile={() => setShowProfile(true)}
          isActive={activeSelectedUser?.isOnline || false} 
        />
      </div>

      {/* Create Group Modal */}
      {showCreateGroup && (
        <CreateGroupModal
          currentUser={currentUser}
          users={usersWithPresence}
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
          users={usersWithPresence}
          onClose={() => setShowGroupInfo(false)}
          onGroupUpdated={handleGroupUpdated}
        />
      )}

      {/* Profile Modal */}
      {showProfile && (
        <ProfileModal
          selectedUser={activeSelectedUser}
          onClose={() => setShowProfile(false)}
        />
      )}
    </div>
  );
}
