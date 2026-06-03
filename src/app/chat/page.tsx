"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Search,
  User,
  MessageCircle,
  Paperclip,
  Smile,
  Plus,
  Users,
  Settings,
  UserPlus,
  UserMinus,
  FileText,
  X,
  UserCheck,
  UserRoundX,
} from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  where,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  Timestamp,
} from "firebase/firestore";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import Link from "next/link";
import type { EmojiClickData } from "emoji-picker-react";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

interface User {
  uid: string;
  name: string;
  avatar?: string;
  email: string;
  bio?: string;
}

interface Group {
  id: string;
  name: string;
  description?: string;
  members: string[];
  admins: string[];
  createdBy: string;
  createdAt: Timestamp | null;
}

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

export default function ChatPage() {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const selectedGroupRef = useRef<Group | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);

  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [descriptionDraft, setDescriptionDraft] = useState("");
  const [uploadingFile, setUploadingFile] = useState(false);
  const [pendingFile, setPendingFile] = useState<PendingFile | null>(null);

  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const MAX_DESCRIPTION_LENGTH = 200;

  // Update ref
  useEffect(() => {
    selectedGroupRef.current = selectedGroup;
  }, [selectedGroup]);

  // Dedicated real-time listener for currently selected group
  useEffect(() => {
    if (!selectedGroup?.id || !currentUser) return;

    const groupRef = doc(db, "groups", selectedGroup.id);

    const unsubscribe = onSnapshot(groupRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const updatedGroup: Group = {
          id: docSnap.id,
          name: data.name,
          description: data.description || "",
          members: data.members || [],
          admins: data.admins || [data.createdBy],
          createdBy: data.createdBy,
          createdAt: data.createdAt,
        };

        setSelectedGroup(updatedGroup);
        selectedGroupRef.current = updatedGroup;
      }
    });

    return () => unsubscribe();
  }, [selectedGroup?.id, currentUser]);

  // Reset description editing
  useEffect(() => {
    if (!showGroupInfo) {
      setEditingDescription(false);
      setShowAddMember(false);
      return;
    }
    if (selectedGroup) {
      setDescriptionDraft(selectedGroup.description || "");
    }
  }, [showGroupInfo, selectedGroup]);

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

  useEffect(() => {
    return () => {
      if (pendingFile?.previewUrl) URL.revokeObjectURL(pendingFile.previewUrl);
    };
  }, [pendingFile]);

  // Close emoji picker on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        emojiButtonRef.current?.contains(e.target as Node) ||
        pickerRef.current?.contains(e.target as Node)
      )
        return;
      setShowEmojiPicker(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        fetchUsers(user.uid);
        fetchGroups(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUsers = (currentUid: string) => {
    const q = query(collection(db, "users"), where("uid", "!=", currentUid));
    onSnapshot(q, (snapshot) => {
      setUsers(snapshot.docs.map((d) => ({ uid: d.id, ...d.data() }) as User));
      setLoading(false);
    });
  };

  const fetchGroups = (currentUid: string) => {
    const q = query(
      collection(db, "groups"),
      where("members", "array-contains", currentUid),
    );
    onSnapshot(q, (snapshot) => {
      const groupList: Group[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          admins: data.admins || [data.createdBy],
        } as Group;
      });
      setGroups(groupList);
    });
  };

  // Messages listener
  useEffect(() => {
    if (!currentUser) return;

    let chatId: string | null = null;
    if (selectedGroup) chatId = selectedGroup.id;
    else if (selectedUser)
      chatId = [currentUser.uid, selectedUser.uid].sort().join("_");

    if (!chatId) return;

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
    if (!currentUser || (!selectedUser && !selectedGroup)) {
      setTypingUsers([]);
      return;
    }

    const chatId = selectedGroup
      ? selectedGroup.id
      : [currentUser.uid, selectedUser!.uid].sort().join("_");

    const typingRef = collection(db, "chats", chatId, "typing");

    const unsubscribe = onSnapshot(typingRef, (snapshot) => {
      const currentlyTyping: string[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const userId = docSnap.id;
        if (
          data.isTyping &&
          Date.now() - (data.lastTyped?.toDate?.() || new Date()).getTime() <
            5000 &&
          userId !== currentUser.uid
        ) {
          const name = selectedGroup
            ? users.find((u) => u.uid === userId)?.name || "Someone"
            : selectedUser?.name || "User";
          currentlyTyping.push(name);
        }
      });
      setTypingUsers(currentlyTyping);
    });
    return unsubscribe;
  }, [selectedUser, selectedGroup, currentUser, users]);

  const createGroup = async () => {
    if (!groupName.trim() || !currentUser) return;

    try {
      const groupData = {
        name: groupName.trim(),
        description: groupDescription.trim() || "",
        members: [currentUser.uid, ...selectedMembers],
        admins: [currentUser.uid],
        createdBy: currentUser.uid,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "groups"), groupData);
      await setDoc(doc(db, "chats", docRef.id), {
        type: "group",
        name: groupName.trim(),
      });

      setGroupName("");
      setGroupDescription("");
      setSelectedMembers([]);
      setShowCreateGroup(false);

      setSelectedGroup({ id: docRef.id, ...groupData } as Group);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  const sendMessage = async () => {
    const text = newMessage.trim();
    if ((!text && !pendingFile) || !currentUser || sending) return;
    setSending(true);
    setUploadingFile(Boolean(pendingFile));

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
        senderName: getSenderName(),
        createdAt: serverTimestamp(),
      });

      setNewMessage("");
      setPendingFile(null);
    } catch (error) {
      console.error("Error sending message:", error);
      alert(pendingFile ? "Failed to upload file" : "Failed to send message");
    } finally {
      setUploadingFile(false);
      setSending(false);
    }
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

  const isAdmin = (group: Group | null): boolean => {
    if (!group || !currentUser) return false;
    return (group.admins || [group.createdBy]).includes(currentUser.uid);
  };

  const promoteToAdmin = async (userId: string) => {
    if (!selectedGroup || !isAdmin(selectedGroup)) return;
    await updateDoc(doc(db, "groups", selectedGroup.id), {
      admins: arrayUnion(userId),
    });

    setSelectedGroup((prev) =>
      prev ? { ...prev, admins: [...(prev.admins || []), userId] } : null,
    );
  };

  const demoteFromAdmin = async (userId: string) => {
    if (!selectedGroup || !isAdmin(selectedGroup)) return;
    if ((selectedGroup.admins || []).length <= 1) {
      alert("Cannot remove the last admin");
      return;
    }
    await updateDoc(doc(db, "groups", selectedGroup.id), {
      admins: arrayRemove(userId),
    });

    setSelectedGroup((prev) =>
      prev
        ? { ...prev, admins: (prev.admins || []).filter((id) => id !== userId) }
        : null,
    );
  };

  const saveGroupDescription = async () => {
    if (!selectedGroup) return;
    const trimmed = descriptionDraft.trim();

    if (trimmed.length > MAX_DESCRIPTION_LENGTH) {
      alert(`Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters.`);
      return;
    }

    await updateDoc(doc(db, "groups", selectedGroup.id), {
      description: trimmed,
    });
    setEditingDescription(false);
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    let value = e.target.value;
    if (value.length > MAX_DESCRIPTION_LENGTH) {
      value = value.slice(0, MAX_DESCRIPTION_LENGTH);
    }
    setDescriptionDraft(value);
  };

  const onEmojiClick = (emojiObject: EmojiClickData) => {
    setNewMessage((prev) => prev + emojiObject.emoji);
  };

  const addMemberToGroup = async (userId: string) => {
    if (!selectedGroup || !isAdmin(selectedGroup)) return;

    await updateDoc(doc(db, "groups", selectedGroup.id), {
      members: arrayUnion(userId),
    });

    setSelectedGroup((prev) =>
      prev && !prev.members.includes(userId)
        ? { ...prev, members: [...prev.members, userId] }
        : prev,
    );
  };

  const removeMemberFromGroup = async (userId: string) => {
    if (!selectedGroup || !isAdmin(selectedGroup)) return;

    await updateDoc(doc(db, "groups", selectedGroup.id), {
      members: arrayRemove(userId),
      admins: arrayRemove(userId), // also remove from admin if needed
    });

    setSelectedGroup((prev) =>
      prev
        ? {
            ...prev,
            members: prev.members.filter((id) => id !== userId),
            admins: (prev.admins || []).filter((id) => id !== userId),
          }
        : null,
    );
  };

  const uploadFileToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");
    return data.url;
  };

  const handleFileSelect = (file: File) => {
    setPendingFile((prev) => {
      if (prev?.previewUrl) URL.revokeObjectURL(prev.previewUrl);
      return {
        file,
        previewUrl: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : undefined,
      };
    });
  };

  const removePendingFile = () => {
    setPendingFile((prev) => {
      if (prev?.previewUrl) URL.revokeObjectURL(prev.previewUrl);
      return null;
    });
  };

  const getDownloadUrl = (url: string) =>
    url.includes("/upload/")
      ? url.replace("/upload/", "/upload/fl_attachment/")
      : url;

  const getInitial = (name: string) => name?.charAt(0).toUpperCase() || "?";
  const getSenderName = () =>
    currentUser?.displayName || currentUser?.email?.split("@")[0] || "You";

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const usersAvailableToAdd = selectedGroup
    ? users.filter((user) => !selectedGroup.members.includes(user.uid))
    : [];

  const typingText =
    typingUsers.length === 0
      ? ""
      : typingUsers.length === 1
        ? `${typingUsers[0]} is typing`
        : typingUsers.length === 2
          ? `${typingUsers[0]} and ${typingUsers[1]} are typing`
          : `${typingUsers[0]} and ${typingUsers.length - 1} others are typing`;

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Please login{" "}
        <Link href="/login" className="ml-2 text-violet-500 hover:underline">
          here
        </Link>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black text-white flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 border-r border-white/10 bg-zinc-950 flex flex-col">
        <div className="p-5 border-b border-white/10">
          <div className="flex justify-between items-center mb-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold tracking-tighter">Pulse</h1>
            </Link>
            <button
              onClick={() => setShowCreateGroup(true)}
              className="w-10 h-10 bg-violet-600 hover:bg-violet-700 rounded-2xl flex items-center justify-center transition-all"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search users or groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 rounded-2xl pl-11 py-3 text-sm focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2 scrollbar-hide">
          {filteredGroups.length > 0 && (
            <>
              <div className="px-5 py-3 text-xs font-semibold text-gray-500 flex items-center gap-2">
                <Users className="w-4 h-4" /> GROUPS
              </div>
              {filteredGroups.map((group) => (
                <div
                  key={group.id}
                  onClick={() => {
                    setSelectedGroup(group);
                    setSelectedUser(null);
                  }}
                  className={`px-5 py-4 flex gap-4 hover:bg-white/5 cursor-pointer transition-all ${
                    selectedGroup?.id === group.id ? "bg-white/10" : ""
                  }`}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl flex items-center justify-center text-2xl">
                    👥
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{group.name}</p>
                    <p className="text-sm text-gray-400">
                      {group.members.length} members
                    </p>
                  </div>
                </div>
              ))}
            </>
          )}

          <div className="px-5 py-3 text-xs font-semibold text-gray-500 flex items-center gap-2 mt-4">
            <User className="w-4 h-4" /> USERS
          </div>
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin w-6 h-6 border-4 border-violet-500 border-t-transparent rounded-full" />
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.uid}
                onClick={() => {
                  setSelectedUser(user);
                  setSelectedGroup(null);
                }}
                className={`px-5 py-4 flex gap-4 hover:bg-white/5 cursor-pointer transition-all ${
                  selectedUser?.uid === user.uid ? "bg-white/10" : ""
                }`}
              >
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-2xl"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-2xl flex items-center justify-center text-2xl font-semibold">
                    {getInitial(user.name)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{user.name}</p>
                  <p className="text-sm text-gray-400 truncate">{user.email}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {selectedUser || selectedGroup ? (
          <>
            <div className="h-20 border-b border-white/10 px-8 flex items-center justify-between bg-zinc-950 flex-shrink-0">
              <div className="flex items-center gap-4">
                {selectedGroup ? (
                  <>
                    <div className="w-11 h-11 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl flex items-center justify-center text-3xl">
                      👥
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl">
                        {selectedGroup.name}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {selectedGroup.members.length} members
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-2xl flex items-center justify-center text-3xl font-semibold">
                      {getInitial(selectedUser!.name)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl">
                        {selectedUser!.name}
                      </h3>
                      <p className="text-green-500 text-sm">Online</p>
                    </div>
                  </div>
                )}
              </div>

              {selectedGroup && (
                <button
                  onClick={() => setShowGroupInfo(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"
                >
                  <Settings className="w-5 h-5" /> Group Info
                </button>
              )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-8 overflow-y-auto space-y-8 bg-zinc-950 scrollbar-hide">
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
                      <div className="w-9 h-9 rounded-2xl mr-3 mt-1 flex-shrink-0 bg-zinc-700 flex items-center justify-center text-lg font-medium">
                        {getInitial(msg.senderName)}
                      </div>
                    )}
                    <div className="max-w-[65%]">
                      <div
                        className={`text-xs text-gray-500 mb-1.5 px-2 ${msg.isMe ? "text-right" : "text-left"}`}
                      >
                        {msg.isMe ? "You" : msg.senderName} • {msg.time}
                      </div>
                      {msg.text && (
                        <div
                          className={`px-6 py-4 rounded-3xl text-[17px] leading-relaxed whitespace-pre-wrap break-words ${
                            msg.isMe
                              ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-tr-none"
                              : "bg-zinc-900 rounded-tl-none"
                          }`}
                        >
                          {msg.text}
                        </div>
                      )}
                      {msg.fileUrl && (
                        <div
                          className={`mt-2 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 ${
                            msg.isMe ? "ml-auto" : ""
                          }`}
                        >
                          {msg.fileType?.startsWith("image") ? (
                            <Image
                              src={msg.fileUrl}
                              alt={msg.fileName || "Uploaded file"}
                              width={384}
                              height={320}
                              className="max-h-80 w-full max-w-sm object-cover"
                            />
                          ) : (
                            <a
                              href={getDownloadUrl(msg.fileUrl)}
                              target="_blank"
                              rel="noreferrer"
                              download={msg.fileName || true}
                              className="block px-5 py-4 text-sm text-violet-300 hover:text-violet-200"
                            >
                              {msg.fileName || "Download file"}
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
                  <div className="w-9 h-9 rounded-2xl mr-3 mt-1 bg-zinc-700 flex items-center justify-center text-lg">
                    👥
                  </div>
                  <div className="bg-zinc-900 rounded-3xl px-6 py-4 text-gray-400 flex items-center gap-2">
                    {typingText}
                    <span className="flex gap-1 ml-1">
                      <span className="animate-bounce">.</span>
                      <span className="animate-bounce [animation-delay:150ms]">
                        .
                      </span>
                      <span className="animate-bounce [animation-delay:300ms]">
                        .
                      </span>
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-white/10 bg-zinc-950 flex-shrink-0">
              <div className="bg-zinc-900 rounded-3xl px-6 py-4 relative">
                {pendingFile && (
                  <div className="mb-4 flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      {pendingFile.previewUrl ? (
                        <div
                          aria-label={pendingFile.file.name}
                          className="h-12 w-12 flex-shrink-0 rounded-xl bg-cover bg-center"
                          style={{
                            backgroundImage: `url(${pendingFile.previewUrl})`,
                          }}
                        />
                      ) : (
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-zinc-800">
                          <FileText className="h-6 w-6 text-violet-300" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {pendingFile.file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(pendingFile.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={removePendingFile}
                      disabled={sending}
                      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-50"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <input
                    type="file"
                    className="hidden"
                    id="fileUpload"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      handleFileSelect(file);
                      e.target.value = "";
                    }}
                  />

                  <label
                    htmlFor="fileUpload"
                    className={`cursor-pointer p-2 mt-1 ${
                      uploadingFile ? "pointer-events-none opacity-50" : ""
                    }`}
                  >
                    {uploadingFile ? (
                      <div className="w-6 h-6 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
                    ) : (
                      <Paperclip className="w-6 h-6 text-gray-400 hover:text-white" />
                    )}
                  </label>
                  <button
                    ref={emojiButtonRef}
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="text-gray-400 hover:text-white p-2 mt-1"
                  >
                    <Smile className="w-6 h-6" />
                  </button>

                  <textarea
                    value={newMessage}
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                      handleTyping();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent outline-none text-lg placeholder:text-gray-500 resize-none py-3 scrollbar-hide"
                    rows={1}
                  />

                  <button
                    onClick={sendMessage}
                    disabled={(!newMessage.trim() && !pendingFile) || sending}
                    className="text-gray-400 px-8 py-3 rounded-2xl font-semibold flex items-center gap-2 hover:text-white disabled:opacity-50 self-end"
                  >
                    <Send className="w-6 h-6" />
                  </button>
                </div>

                {showEmojiPicker && (
                  <div
                    ref={pickerRef}
                    className="absolute bottom-full left-12 mb-2 z-50 shadow-2xl"
                  >
                    <EmojiPicker
                      onEmojiClick={onEmojiClick}
                      width={320}
                      height={400}
                      previewConfig={{ showPreview: false }}
                    />
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-xl">
            Select a user or group to start chatting
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      {showCreateGroup && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Create New Group</h2>
            <input
              type="text"
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full bg-zinc-800 border border-white/10 rounded-2xl px-5 py-4 mb-6 focus:outline-none focus:border-violet-500"
            />
            <textarea
              placeholder="Group Description (optional)"
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              className="w-full bg-zinc-800 border border-white/10 rounded-2xl px-5 py-4 mb-6 h-24"
            />
            <p className="text-sm text-gray-400 mb-3">Select Members</p>
            <div className="max-h-80 overflow-y-auto space-y-2 mb-8">
              {users.map((user) => (
                <div
                  key={user.uid}
                  onClick={() =>
                    setSelectedMembers((prev) =>
                      prev.includes(user.uid)
                        ? prev.filter((id) => id !== user.uid)
                        : [...prev, user.uid],
                    )
                  }
                  className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${
                    selectedMembers.includes(user.uid)
                      ? "bg-violet-600/20 border border-violet-500"
                      : "hover:bg-white/5"
                  }`}
                >
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-2xl"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-2xl flex items-center justify-center text-2xl font-semibold">
                      {getInitial(user.name)}
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowCreateGroup(false)}
                className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 rounded-2xl"
              >
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
      )}

      {/* Group Info Modal */}
      {showGroupInfo && selectedGroup && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-4xl p-8 max-h-[90vh] overflow-y-auto scrollbar-hide">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Group Info</h2>
              <button
                onClick={() => setShowGroupInfo(false)}
                className="text-3xl text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="mb-8">
              <p className="text-sm text-gray-400">Group Name</p>
              <p className="text-xl font-semibold mt-1">{selectedGroup.name}</p>

              {editingDescription ? (
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between items-center text-sm text-gray-400 mb-1">
                    <span>Description</span>
                    <span
                      className={
                        descriptionDraft.length > 180 ? "text-orange-400" : ""
                      }
                    >
                      {descriptionDraft.length}/{MAX_DESCRIPTION_LENGTH}
                    </span>
                  </div>
                  <textarea
                    value={descriptionDraft}
                    onChange={handleDescriptionChange}
                    placeholder="Enter group description..."
                    className="w-full bg-zinc-800 border border-white/10 rounded-2xl px-5 py-4 text-sm resize-none min-h-[120px] focus:outline-none focus:border-violet-500"
                    maxLength={MAX_DESCRIPTION_LENGTH}
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={saveGroupDescription}
                      disabled={!descriptionDraft.trim()}
                      className="px-6 py-3 bg-violet-600 hover:bg-violet-700 rounded-2xl text-sm font-medium disabled:opacity-50"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingDescription(false);
                        setDescriptionDraft(selectedGroup.description || "");
                      }}
                      className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-2xl text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p
                  className={`mt-4 text-[15px] leading-relaxed cursor-pointer hover:text-white ${
                    selectedGroup.description
                      ? "text-gray-300"
                      : "text-gray-500 italic"
                  }`}
                  onClick={() => setEditingDescription(true)}
                >
                  {selectedGroup.description ||
                    "No description provided. Click to add."}
                </p>
              )}
            </div>

            <div>
              <div className="flex justify-between mb-4">
                <p className="font-semibold">
                  Members ({selectedGroup.members.length})
                </p>
                {isAdmin(selectedGroup) && (
                  <button
                    className="text-violet-400 text-sm flex items-center gap-1 hover:text-violet-300"
                    onClick={() => setShowAddMember(true)}
                  >
                    <UserPlus className="w-4 h-4" /> Add Member
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {selectedGroup.members.map((uid) => {
                  const isCurrentUser = uid === currentUser.uid;

                  const member =
                    users.find((u) => u.uid === uid) ||
                    (isCurrentUser
                      ? {
                          uid,
                          name:
                            (currentUser.displayName ||
                              currentUser.email?.split("@")[0] ||
                              "You") + " (You)",
                          email: currentUser.email || "",
                          avatar: currentUser.photoURL || undefined,
                        }
                      : {
                          uid,
                          name: "Unknown User",
                          email: "",
                          avatar: undefined,
                        });

                  const isGroupAdmin = (
                    selectedGroup.admins || [selectedGroup.createdBy]
                  ).includes(uid);

                  return (
                    <div
                      key={uid}
                      className="group flex items-center justify-between bg-zinc-900 hover:bg-zinc-800 transition-all p-4 rounded-2xl border border-white/5"
                    >
                      {/* LEFT SIDE */}
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        {member.avatar ? (
                          <Image
                            src={member.avatar}
                            alt={member.name}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-xl flex items-center justify-center text-xl font-semibold">
                            {getInitial(member.name)}
                          </div>
                        )}

                        {/* Name + Email */}
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{member.name}</p>

                            {isGroupAdmin && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/30">
                                Admin
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-gray-500 truncate max-w-[200px]">
                            {member.email || "No email"}
                          </p>
                        </div>
                      </div>

                      {/* RIGHT SIDE ACTIONS */}
                      {isAdmin(selectedGroup) && uid !== currentUser.uid && (
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          {!isGroupAdmin ? (
                            <button
                              onClick={() => promoteToAdmin(uid)}
                              className="text-xs px-3 py-1.5 text-violet-400 hover:text-violet-600 rounded-lg"
                              title="Promote to Admin"
                            >
                              <UserCheck className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => demoteFromAdmin(uid)}
                              className="text-xs px-3 py-1.5 text-yellow-400 hover:text-yellow-600 rounded-lg"
                              title="Demote from Admin"
                            >
                              <UserRoundX className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            onClick={() => removeMemberFromGroup(uid)}
                            className="text-xs px-3 py-1.5 text-red-400 hover:text-red-600 rounded-lg"
                            title="Remove from group"
                          >
                            <UserMinus className="w-4 h-4" />
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
      )}

      {/* Add Member Modal */}
      {showAddMember && selectedGroup && isAdmin(selectedGroup) && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60]">
          <div className="bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Add Member</h2>
              <button
                onClick={() => setShowAddMember(false)}
                className="text-3xl text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>

            {usersAvailableToAdd.length === 0 ? (
              <div className="py-10 text-center text-gray-400">
                Everyone is already in this group.
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto space-y-2 scrollbar-hide">
                {usersAvailableToAdd.map((user) => (
                  <button
                    key={user.uid}
                    onClick={async () => {
                      try {
                        await addMemberToGroup(user.uid);
                      } catch (error) {
                        console.error("Error adding member:", error);
                        alert("Failed to add member");
                      }
                    }}
                    className="w-full flex items-center justify-between gap-4 p-4 rounded-2xl text-left hover:bg-white/5 transition-all"
                  >
                    <span className="flex items-center gap-4 min-w-0">
                      {user.avatar ? (
                        <Image
                          src={user.avatar}
                          alt={user.name}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-2xl object-cover"
                        />
                      ) : (
                        <span className="w-12 h-12 bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-2xl flex items-center justify-center text-2xl font-semibold flex-shrink-0">
                          {getInitial(user.name)}
                        </span>
                      )}
                      <span className="min-w-0">
                        <span className="block font-medium truncate">
                          {user.name}
                        </span>
                        <span className="block text-sm text-gray-500 truncate">
                          {user.email}
                        </span>
                      </span>
                    </span>
                    <UserPlus className="w-5 h-5 text-violet-400 flex-shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
