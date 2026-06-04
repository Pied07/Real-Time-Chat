"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Paperclip,
  Smile,
  X,
  FileText,
  User,
  Users,
} from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import type { EmojiClickData } from "emoji-picker-react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
} from "firebase/firestore";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  time: string;
  isMe: boolean;
  fileUrl?: string;
  fileType?: string;
  fileName?: string;
}

interface PendingFile {
  file: File;
  previewUrl?: string;
}

interface ChatAreaProps {
  currentUser: any;
  selectedUser: any;
  selectedGroup: any;
  onOpenGroupInfo: () => void;
  onOpenProfile: () => void;
}

export default function ChatArea({
  currentUser,
  selectedUser,
  selectedGroup,
  onOpenGroupInfo,
  onOpenProfile,
}: ChatAreaProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [pendingFile, setPendingFile] = useState<PendingFile | null>(null);
  const [sending, setSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(
      () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
      100,
    );
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers]);

  // Messages Listener
  useEffect(() => {
    if (!currentUser || (!selectedUser && !selectedGroup)) return;

    const chatId = selectedGroup
      ? selectedGroup.id
      : [currentUser.uid, selectedUser.uid].sort().join("_");

    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt", "asc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            text: data.text || "",
            senderId: data.senderId,
            senderName: data.senderName,
            time: new Date(
              data.createdAt?.toDate() || Date.now(),
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isMe: data.senderId === currentUser.uid,
            fileUrl: data.fileUrl,
            fileType: data.fileType,
            fileName: data.fileName,
          };
        }),
      );
    });

    return unsubscribe;
  }, [selectedUser, selectedGroup, currentUser]);

  // Typing Indicator
  useEffect(() => {
    if (!currentUser || (!selectedUser && !selectedGroup)) return;

    const chatId = selectedGroup
      ? selectedGroup.id
      : [currentUser.uid, selectedUser.uid].sort().join("_");

    const typingRef = collection(db, "chats", chatId, "typing");

    const unsubscribe = onSnapshot(typingRef, (snapshot) => {
      const currentlyTyping: string[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (
          data.isTyping &&
          Date.now() - (data.lastTyped?.toDate?.() || new Date()).getTime() <
            5000 &&
          docSnap.id !== currentUser.uid
        ) {
          currentlyTyping.push(
            selectedGroup ? "Someone" : selectedUser?.name || "User",
          );
        }
      });
      setTypingUsers(currentlyTyping);
    });

    return unsubscribe;
  }, [selectedUser, selectedGroup, currentUser]);

  const sendMessage = async () => {
    const text = newMessage.trim();
    if ((!text && !pendingFile) || !currentUser || sending) return;

    setSending(true);
    const chatId = selectedGroup
      ? selectedGroup.id
      : [currentUser.uid, selectedUser!.uid].sort().join("_");

    try {
      let fileUrl: string | undefined;
      let fileType: string | undefined;
      let fileName: string | undefined;

      if (pendingFile) {
        fileUrl = await uploadFileToCloudinary(pendingFile.file);
        fileType = pendingFile.file.type;
        fileName = pendingFile.file.name;
      }

      await addDoc(collection(db, "chats", chatId, "messages"), {
        text,
        ...(fileUrl ? { fileUrl, fileType, fileName } : {}),
        senderId: currentUser.uid,
        senderName:
          currentUser.displayName || currentUser.email?.split("@")[0] || "You",
        createdAt: serverTimestamp(),
      });

      setNewMessage("");
      setPendingFile(null);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const uploadFileToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");
    return data.url;
  };

  const handleFileSelect = (file: File) => {
    setPendingFile({
      file,
      previewUrl: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : undefined,
    });
  };

  const removePendingFile = () => {
    if (pendingFile?.previewUrl) URL.revokeObjectURL(pendingFile.previewUrl);
    setPendingFile(null);
  };

  const onEmojiClick = (emojiObject: EmojiClickData) => {
    setNewMessage((prev) => prev + emojiObject.emoji);
  };

  const handleTyping = () => {
    if (!currentUser || (!selectedUser && !selectedGroup)) return;
    const chatId = selectedGroup
      ? selectedGroup.id
      : [currentUser.uid, selectedUser!.uid].sort().join("_");

    const typingRef = doc(db, "chats", chatId, "typing", currentUser.uid);
    setDoc(
      typingRef,
      { isTyping: true, lastTyped: serverTimestamp() },
      { merge: true },
    );
    setTimeout(
      () => setDoc(typingRef, { isTyping: false }, { merge: true }),
      4000,
    );
  };

  if (!selectedUser && !selectedGroup) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 text-xl bg-zinc-950">
        Select a friend or group to start chatting
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-950">
      {/* Chat Header */}
      <div className="h-20 border-b border-white/10 px-8 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          {selectedGroup ? (
            <>
              <div className="w-11 h-11 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl flex items-center justify-center text-3xl">
                👥
              </div>
              <div>
                <h3 className="font-semibold text-xl">{selectedGroup.name}</h3>
                <p className="text-sm text-gray-400">
                  {selectedGroup.members.length} members
                </p>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-zinc-700 rounded-2xl flex items-center justify-center text-3xl">
                {selectedUser?.name?.[0]?.toUpperCase() || "?"}
              </div>
              <div>
                <h3 className="font-semibold text-xl">{selectedUser?.name}</h3>
                <p className="text-green-500 text-sm">Online</p>
              </div>
            </div>
          )}
        </div>

        {selectedGroup ? (
          <button
            onClick={onOpenGroupInfo}
            className="px-5 py-2.5 text-gray-400 hover:text-white rounded-2xl transition-all flex items-center gap-2"
            title="View Group Info"
          >
            <Users />
          </button>
        ): (
          <button
            onClick={onOpenProfile}
            className="px-5 py-2.5 text-gray-400 hover:text-white rounded-2xl transition-all flex items-center gap-2"
            title="View Profile"
          >
            <User />
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-8 overflow-y-auto space-y-8 scrollbar-hide">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <div className="text-6xl mb-4">👋</div>
            <p>Say hello to start the conversation</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}
            >
              {!msg.isMe && (
                <div className="w-9 h-9 rounded-2xl mr-3 mt-1 bg-zinc-700 flex items-center justify-center text-lg">
                  {msg.senderName?.[0]?.toUpperCase() || "?"}
                </div>
              )}
              <div className="max-w-[65%]">
                <div
                  className={`text-xs text-gray-500 mb-1.5 px-2 ${msg.isMe ? "text-right" : ""}`}
                >
                  {msg.isMe ? "You" : msg.senderName} • {msg.time}
                </div>
                {msg.text && (
                  <div
                    className={`px-6 py-4 rounded-3xl text-[17px] leading-relaxed whitespace-pre-wrap ${
                      msg.isMe
                        ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-tr-none"
                        : "bg-zinc-900 rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                )}
                {msg.fileUrl && (
                  <div className="mt-2 rounded-2xl overflow-hidden border border-white/10 bg-zinc-900">
                    {msg.fileType?.startsWith("image") ? (
                      <Image
                        src={msg.fileUrl}
                        alt="image"
                        width={400}
                        height={300}
                        className="max-h-80 object-cover"
                      />
                    ) : (
                      <a
                        href={msg.fileUrl}
                        target="_blank"
                        className="block p-4 text-violet-300 hover:text-violet-200"
                      >
                        📎 {msg.fileName}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {typingUsers.length > 0 && (
          <div className="flex justify-start">
            <div className="bg-zinc-900 rounded-3xl px-6 py-4 text-gray-400 flex">
              Typing
              <span className="flex ml-1 gap-1">
                <span className="animate-bounce text-2xl">.</span>
                <span className="animate-bounce [animation-delay:150ms] text-2xl">
                  .
                </span>
                <span className="animate-bounce [animation-delay:300ms] text-2xl">
                  .
                </span>
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-white/10 bg-zinc-950">
        <div className="bg-zinc-900 rounded-3xl px-6 py-4 relative">
          {pendingFile && (
            <div className="mb-4 flex items-center gap-4 bg-zinc-950 p-4 rounded-2xl border border-white/10">
              {pendingFile.previewUrl ? (
                <Image
                  src={pendingFile.previewUrl}
                  alt="preview"
                  width={60}
                  height={60}
                  className="rounded-xl object-cover"
                />
              ) : (
                <FileText className="w-10 h-10 text-violet-300" />
              )}
              <div className="flex-1 min-w-0">
                <p className="truncate">{pendingFile.file.name}</p>
                <p className="text-xs text-gray-500">
                  {(pendingFile.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={removePendingFile}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
          )}

          <div className="flex items-start gap-4">
            <label className="cursor-pointer p-2 mt-1">
              <input
                type="file"
                className="hidden"
                onChange={(e) =>
                  e.target.files?.[0] && handleFileSelect(e.target.files[0])
                }
              />
              <Paperclip className="w-6 h-6 text-gray-400 hover:text-white" />
            </label>

            <button
              ref={emojiButtonRef}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 mt-1"
            >
              <Smile className="w-6 h-6 text-gray-400 hover:text-white" />
            </button>

            <textarea
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTyping();
              }}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                !e.shiftKey &&
                (e.preventDefault(), sendMessage())
              }
              placeholder="Type a message..."
              className="flex-1 bg-transparent outline-none text-lg placeholder:text-gray-500 resize-none py-3 max-h-32 scrollbar-hide"
              rows={1}
            />

            <button
              onClick={sendMessage}
              disabled={(!newMessage.trim() && !pendingFile) || sending}
              className="self-end p-3 text-violet-400 hover:text-violet-300 disabled:opacity-50"
            >
              <Send className="w-6 h-6" />
            </button>
          </div>

          {showEmojiPicker && (
            <div
              ref={pickerRef}
              className="absolute bottom-full left-12 mb-2 z-50"
            >
              <EmojiPicker
                onEmojiClick={onEmojiClick}
                width={320}
                height={400}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
