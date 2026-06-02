"use client";

import React, { useState, useEffect } from "react";
import {
  Send,
  Phone,
  Video,
  Users,
  Search,
  MoreVertical,
  Smile,
  Paperclip,
  User,
} from "lucide-react";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { MessageCircle } from "lucide-react";
import Link from "next/link";

interface User {
  uid: string;
  name: string;
  avatar?: string;
  email: string;
  bio?: string;
}

interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  time: string;
  isMe: boolean;
}

export default function ChatPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);

  // Auth & Users
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) fetchUsers(user.uid);
    });
    return () => unsubscribeAuth();
  }, []);

  const fetchUsers = (currentUid: string) => {
    const q = query(collection(db, "users"), where("uid", "!=", currentUid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userList: User[] = snapshot.docs.map(
        (doc) =>
          ({
            uid: doc.id,
            ...doc.data(),
          }) as User,
      );
      setUsers(userList);
      setLoading(false);
    });
    return unsubscribe;
  };

  // Messages listener (same as before)
  useEffect(() => {
    if (!selectedUser || !currentUser) return;

    const chatId = [currentUser.uid, selectedUser.uid].sort().join("_");
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          text: data.text,
          senderId: data.senderId,
          senderName: data.senderName,
          time: new Date(
            data.createdAt?.toDate() || Date.now(),
          ).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isMe: data.senderId === currentUser.uid,
        };
      });
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [selectedUser, currentUser]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedUser) return;
    // TODO: Implement addDoc here later
    setNewMessage("");
  };

  const openProfile = () => {
    setShowProfile(true);
  };

  const getInitial = (name: string) => name.charAt(0).toUpperCase();

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Please login
        <Link href="/login" className="ml-2 text-violet-500 hover:underline">
          here
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex overflow-hidden">
      {/* Left Sidebar - Users */}
      <div className="w-80 border-r border-white/10 bg-zinc-950 flex flex-col">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold tracking-tighter">Pulse</h1>
            </Link>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 rounded-2xl pl-11 py-3 text-sm focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin w-6 h-6 border-4 border-violet-500 border-t-transparent rounded-full"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <p className="text-center text-gray-500 py-10">No users found</p>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.uid}
                onClick={() => setSelectedUser(user)}
                className={`px-5 py-4 flex gap-4 hover:bg-white/5 cursor-pointer transition-all ${selectedUser?.uid === user.uid ? "bg-white/10" : ""}`}
              >
                <div className="relative flex-shrink-0">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-12 h-12 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-2xl flex items-center justify-center text-2xl font-semibold">
                      {getInitial(user.name)}
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-zinc-950"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{user.name}</p>
                  <p className="text-sm text-gray-400 truncate">{user.email}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="h-20 border-b border-white/10 px-8 flex items-center justify-between bg-zinc-950">
              <div className="flex items-center gap-4">
                <div className="relative">
                  {selectedUser.avatar ? (
                    <img
                      src={selectedUser.avatar}
                      alt=""
                      className="w-11 h-11 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="w-11 h-11 bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-2xl flex items-center justify-center text-3xl font-semibold">
                      {getInitial(selectedUser.name)}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-xl">{selectedUser.name}</h3>
                  <p className="text-green-500 text-sm flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Online
                  </p>
                </div>
              </div>

              {/* Call + Profile Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => alert(`Voice call with ${selectedUser.name}`)}
                  className="flex items-center gap-3 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-white/10 rounded-2xl transition-all"
                >
                  <Phone className="w-5 h-5 text-emerald-400" />
                  <span className="font-medium">Voice</span>
                </button>

                <button
                  onClick={() => alert(`Video call with ${selectedUser.name}`)}
                  className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl font-semibold hover:scale-105 transition-all"
                >
                  <Video className="w-5 h-5" />
                  <span>Video Call</span>
                </button>

                {/* New Profile Button */}
                <button
                  onClick={openProfile}
                  className="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Profile</span>
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-8 overflow-y-auto space-y-8 bg-zinc-950">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <div className="text-6xl mb-4">👋</div>
                  <p>Say hello to start chatting with {selectedUser.name}</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}
                  >
                    {!msg.isMe && (
                      <div className="w-9 h-9 rounded-2xl mr-3 mt-1 flex-shrink-0 bg-zinc-700 flex items-center justify-center text-lg font-medium">
                        {getInitial(msg.senderName)}
                      </div>
                    )}
                    <div className={`max-w-[65%]`}>
                      <div className="text-xs text-gray-500 mb-1.5 px-2">
                        {msg.senderName} • {msg.time}
                      </div>
                      <div
                        className={`px-6 py-4 rounded-3xl text-[17px] leading-relaxed ${
                          msg.isMe
                            ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-tr-none"
                            : "bg-zinc-900 rounded-tl-none"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="p-6 border-t border-white/10 bg-zinc-950">
              <div className="bg-zinc-900 rounded-3xl px-6 py-4 flex items-center gap-4">
                <button className="text-gray-400 hover:text-white p-2">
                  <Paperclip className="w-6 h-6" />
                </button>
                <button className="text-gray-400 hover:text-white p-2">
                  <Smile className="w-6 h-6" />
                </button>

                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent outline-none text-lg placeholder:text-gray-500"
                />

                <button
                  onClick={sendMessage}
                  className="bg-white text-black px-8 py-3 rounded-2xl font-semibold flex items-center gap-2 hover:bg-white/90"
                >
                  Send <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-xl">
            Select a user to start chatting
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {showProfile && selectedUser && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-md p-8">
            <div className="flex justify-end">
              <button
                onClick={() => setShowProfile(false)}
                className="text-3xl text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-28 h-28 mb-6 rounded-3xl overflow-hidden border-4 border-white/10">
                {selectedUser.avatar ? (
                  <img
                    src={selectedUser.avatar}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-6xl font-bold">
                    {getInitial(selectedUser.name)}
                  </div>
                )}
              </div>

              <h2 className="text-3xl font-bold mb-1">{selectedUser.name}</h2>
              <p className="text-gray-400 mb-8">{selectedUser.email}</p>

              {selectedUser.bio && (
                <div className="w-full bg-zinc-950 rounded-2xl p-6 text-left mb-8">
                  <p className="text-gray-300">{selectedUser.bio}</p>
                </div>
              )}

              <button
                onClick={() => setShowProfile(false)}
                className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-semibold transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
