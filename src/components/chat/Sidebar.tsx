"use client";
import { useState, useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  documentId,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  UserPlus,
  Search,
  X,
  MessageCircle,
  Users,
  UserMinus,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Props {
  currentUser: any;
  users: any[];
  selectedUser: any;
  setSelectedUser: (user: any) => void;
  selectedGroup: any;
  setSelectedGroup: (group: any) => void;
  onCreateGroup: () => void;
}

export default function Sidebar({
  currentUser,
  users,
  selectedUser,
  setSelectedUser,
  selectedGroup,
  setSelectedGroup,
  onCreateGroup,
}: Props) {
  const [friends, setFriends] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<any[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<
    "chats" | "groups" | "friends" | "requests" | "discover"
  >("chats");
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarWidth, setSidebarWidth] = useState(500);
  const [isResizing, setIsResizing] = useState(false);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const friendsUnsubRef = useRef<(() => void) | null>(null);
  const requestsUnsubRef = useRef<(() => void) | null>(null);
  const groupsUnsubRef = useRef<(() => void) | null>(null);

  // Real-time Data
  useEffect(() => {
    if (!currentUser?.uid) return;

    const userRef = doc(db, "users", currentUser.uid);

    const unsubUser = onSnapshot(userRef, (snap) => {
      const data = snap.data() || {};

      setOutgoingRequests(data.outgoingRequests || []);

      // Friends
      if (data.friends?.length > 0) {
        const friendsQ = query(
          collection(db, "users"),
          where("uid", "in", data.friends),
        );
        friendsUnsubRef.current?.();
        friendsUnsubRef.current = onSnapshot(friendsQ, (snapshot) => {
          setFriends(snapshot.docs.map((d) => ({ ...d.data(), uid: d.id })));
        });
      } else {
        setFriends([]);
        friendsUnsubRef.current?.();
      }

      // Groups
      // Groups (FIXED)
      if (currentUser?.uid) {
        const groupsQ = query(
          collection(db, "groups"),
          where("members", "array-contains", currentUser.uid),
        );

        groupsUnsubRef.current?.();
        groupsUnsubRef.current = onSnapshot(groupsQ, (snapshot) => {
          setGroups(snapshot.docs.map((d) => ({ ...d.data(), id: d.id })));
        });
      } else {
        setGroups([]);
        groupsUnsubRef.current?.();
      }

      // Incoming Requests
      if (data.incomingRequests?.length > 0) {
        const reqQ = query(
          collection(db, "users"),
          where("uid", "in", data.incomingRequests),
        );
        requestsUnsubRef.current?.();
        requestsUnsubRef.current = onSnapshot(reqQ, (snapshot) => {
          setIncomingRequests(
            snapshot.docs.map((d) => ({ ...d.data(), uid: d.id })),
          );
        });
      } else {
        setIncomingRequests([]);
        requestsUnsubRef.current?.();
      }
    });

    return () => {
      unsubUser();
      friendsUnsubRef.current?.();
      groupsUnsubRef.current?.();
      requestsUnsubRef.current?.();
    };
  }, [currentUser?.uid]);

  // Cleanup
  useEffect(() => {
    return () => {
      friendsUnsubRef.current?.();
      groupsUnsubRef.current?.();
      requestsUnsubRef.current?.();
    };
  }, []);

  // Friend Request Functions
  const sendFriendRequest = async (targetUid: string) => {
    await updateDoc(doc(db, "users", currentUser.uid), {
      outgoingRequests: arrayUnion(targetUid),
    });
    await updateDoc(doc(db, "users", targetUid), {
      incomingRequests: arrayUnion(currentUser.uid),
    });
  };

  const cancelFriendRequest = async (targetUid: string) => {
    await updateDoc(doc(db, "users", currentUser.uid), {
      outgoingRequests: arrayRemove(targetUid),
    });
    await updateDoc(doc(db, "users", targetUid), {
      incomingRequests: arrayRemove(currentUser.uid),
    });
  };

  const acceptRequest = async (senderUid: string) => {
    setIncomingRequests((prev) => prev.filter((u) => u.uid !== senderUid));
    await updateDoc(doc(db, "users", currentUser.uid), {
      friends: arrayUnion(senderUid),
      incomingRequests: arrayRemove(senderUid),
    });
    await updateDoc(doc(db, "users", senderUid), {
      friends: arrayUnion(currentUser.uid),
      outgoingRequests: arrayRemove(currentUser.uid),
    });
  };

  const rejectRequest = async (senderUid: string) => {
    setIncomingRequests((prev) => prev.filter((u) => u.uid !== senderUid));
    await updateDoc(doc(db, "users", currentUser.uid), {
      incomingRequests: arrayRemove(senderUid),
    });
  };

  const removeFriend = async (friendUid: string) => {
    await updateDoc(doc(db, "users", currentUser.uid), {
      friends: arrayRemove(friendUid),
    });
    await updateDoc(doc(db, "users", friendUid), {
      friends: arrayRemove(currentUser.uid),
    });
  };

  // Filtered Discover
  const filteredDiscover = users
    .filter(
      (u) =>
        !friends.some((f) => f.uid === u.uid) &&
        !incomingRequests.some((r) => r.uid === u.uid) &&
        u.uid !== currentUser.uid,
    )
    .filter(
      (u) =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()),
    );

  const filteredFriends = friends.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Resize Logic
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = Math.max(450, Math.min(e.clientX, 800));
      setSidebarWidth(newWidth);
    };
    const handleMouseUp = () => setIsResizing(false);

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div
      ref={sidebarRef}
      className="w-full lg:w-[var(--sidebar-width)] border-r border-white/10 bg-zinc-950/60 backdrop-blur-3xl flex flex-col relative z-10 shadow-[0_0_30px_rgba(34,211,238,0.05)]"
      style={
        { "--sidebar-width": `${sidebarWidth}px` } as CSSProperties
      }
    >
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-white/10">
        <div className="flex justify-between items-center mb-5 sm:mb-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.3)] group-hover:scale-110 transition-transform">
              <MessageCircle className="w-5 h-5 text-black" />
            </div>
            <h1 className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">Pulse</h1>
          </Link>
          <button
            onClick={onCreateGroup}
            className="w-9 h-9 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-xl border border-cyan-500/30 flex items-center justify-center transition-all hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
          >
            <UserPlus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-white/10 scrollbar-hide">
        {["chats", "groups", "friends", "requests", "discover"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`min-w-20 flex-1 py-3.5 sm:py-4 text-[10px] font-bold tracking-[2px] uppercase transition-all ${
              activeTab === tab
                ? "text-cyan-400 border-b-2 border-cyan-400 bg-cyan-400/5 shadow-[inset_0_-20px_20px_-20px_rgba(34,211,238,0.2)]"
                : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
            }`}
          >
            {tab === "chats"
              ? "Chats"
              : tab === "groups"
                ? "Groups"
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "groups" && (
        <div className="p-3 sm:p-4 border-b border-white/10">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-2xl pl-11 py-3 text-sm focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.1)] transition-all placeholder:text-zinc-600"
            />
          </div>
        </div>
      )}

      {/* Search for Discover */}
      {activeTab === "discover" && (
        <div className="p-3 sm:p-4 border-b border-white/10">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-2xl pl-11 py-3 text-sm focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.1)] transition-all placeholder:text-zinc-600"
            />
          </div>
        </div>
      )}
      {activeTab === "friends" && (
        <div className="p-3 sm:p-4 border-b border-white/10">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search friends..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-2xl pl-11 py-3 text-sm focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.1)] transition-all placeholder:text-zinc-600"
            />
          </div>
        </div>
      )}

      {activeTab === "chats" && (
        <div className="p-3 sm:p-4 border-b border-white/10">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-2xl pl-11 py-3 text-sm focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.1)] transition-all placeholder:text-zinc-600"
            />
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* CHATS TAB - Direct Messages Only */}
        {activeTab === "chats" &&
          (filteredFriends.length === 0 ? (
            <div className="text-center text-gray-500 py-20">
              No direct messages yet
            </div>
          ) : (
            filteredFriends.map((user) => {
              const isSelected = selectedUser?.uid === user.uid;
              return (
                <div
                  key={user.uid}
                  onClick={() => {
                    setSelectedGroup(null);
                    setSelectedUser(user);
                  }}
                  className={`px-4 sm:px-5 py-4 flex gap-3 sm:gap-4 hover:bg-cyan-500/5 hover:border-l-2 hover:border-l-cyan-400 border-l-2 border-l-transparent cursor-pointer transition-all ${
                    isSelected ? "bg-cyan-500/10 border-l-cyan-400" : ""
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl overflow-hidden flex-shrink-0">
                    {user.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-black flex items-center justify-center text-zinc-500 text-xl font-bold border border-white/5">
                        {user.name?.[0] || "?"}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{user.name}</p>
                    <p className="text-sm text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              );
            })
          ))}

        {/* GROUPS TAB */}
        {activeTab === "groups" &&
          (filteredGroups.length === 0 ? (
            <div className="text-center text-gray-500 py-20">
              No groups yet. Create one using the + button!
            </div>
          ) : (
            filteredGroups.map((group) => {
              const isSelected = selectedGroup?.id === group.id;
              return (
                <div
                  key={group.id}
                  onClick={() => {
                    setSelectedUser(null);
                    setSelectedGroup(group);
                  }}
                  className={`px-4 sm:px-5 py-4 flex gap-3 sm:gap-4 hover:bg-cyan-500/5 hover:border-l-2 hover:border-l-cyan-400 border-l-2 border-l-transparent cursor-pointer transition-all ${
                    isSelected ? "bg-cyan-500/10 border-l-cyan-400" : ""
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{group.name}</p>
                    <p className="text-sm text-gray-400 truncate">
                      {group.members?.length || 0} members
                    </p>
                  </div>
                </div>
              );
            })
          ))}

        {/* FRIENDS TAB (Contacts) */}
        {activeTab === "friends" &&
          (filteredFriends.length === 0 ? (
            <div className="text-center text-gray-500 py-20">
              No friends yet
            </div>
          ) : (
            filteredFriends.map((user) => (
              <div
                key={user.uid}
                className="px-4 sm:px-5 py-4 flex gap-3 sm:gap-4 hover:bg-cyan-500/5 hover:border-l-2 hover:border-l-cyan-400 border-l-2 border-l-transparent transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl overflow-hidden flex-shrink-0 border border-white/5">
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-black flex items-center justify-center text-zinc-500 text-xl font-bold">
                      {user.name?.[0] || "?"}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{user.name}</p>
                  <p className="text-sm text-gray-400 truncate">{user.email}</p>
                </div>
                <button
                  onClick={() => removeFriend(user.uid)}
                  className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 text-red-400 hover:text-red-500 self-center px-3 py-1 rounded-xl hover:bg-red-500/10 transition-all"
                  title="Remove Friend"
                >
                  <UserMinus className="w-5 h-5" />
                </button>
              </div>
            ))
          ))}

        {/* REQUESTS TAB */}
        {activeTab === "requests" &&
          (incomingRequests.length === 0 ? (
            <div className="text-center text-gray-500 py-20">
              No pending requests
            </div>
          ) : (
            incomingRequests.map((user) => (
              <div key={user.uid} className="p-4 sm:p-5 border-b border-white/10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden">
                    {user.avatar ? (
                      <Image
                        src={user.avatar}
                        alt=""
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-black flex items-center justify-center text-xl font-bold text-zinc-500">
                        {user.name?.[0] || "?"}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-400">wants to connect</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => acceptRequest(user.uid)}
                    className="flex-1 py-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 rounded-2xl text-xs font-bold uppercase tracking-[1px] transition-all"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => rejectRequest(user.uid)}
                    className="flex-1 py-3 bg-zinc-800/50 text-zinc-400 border border-white/10 hover:bg-zinc-800 rounded-2xl text-xs font-bold uppercase tracking-[1px] transition-all"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          ))}

        {/* DISCOVER TAB */}
        {activeTab === "discover" &&
          (searchTerm.trim() === "" || searchTerm.length <= 3 ? (
            <div className="text-center text-gray-500 py-20">
              Search for users to find
            </div>
          ) : filteredDiscover.length === 0 ? (
            <div className="text-center text-gray-500 py-20">
              No users found
            </div>
          ) : (
            filteredDiscover.map((user) => {
              const isRequested = outgoingRequests.includes(user.uid);
              return (
                <div
                  key={user.uid}
                  className="px-4 sm:px-5 py-4 flex gap-3 justify-between items-center hover:bg-cyan-500/5 hover:border-l-2 hover:border-l-cyan-400 border-l-2 border-l-transparent transition-all group"
                >
                  <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden">
                      {user.avatar ? (
                        <Image
                          src={user.avatar}
                          alt=""
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-black flex items-center justify-center text-xl font-bold text-zinc-500 border border-white/5">
                          {user.name?.[0] || "?"}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-400 truncate">{user.email}</p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      isRequested
                        ? cancelFriendRequest(user.uid)
                        : sendFriendRequest(user.uid)
                    }
                    className={`flex shrink-0 items-center gap-2 px-3 sm:px-5 py-2.5 rounded-2xl text-xs font-bold tracking-[1px] uppercase transition-all ${
                      isRequested
                        ? "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30"
                        : "border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                    }`}
                  >
                    {isRequested ? (
                      <>
                        <X size={18} /> Cancel
                      </>
                    ) : (
                      <>
                        <UserPlus size={18} /> Add
                      </>
                    )}
                  </button>
                </div>
              );
            })
          ))}
      </div>

      {/* Resize Handle */}
      <div
        className="hidden lg:block absolute right-0 top-0 bottom-0 w-1 bg-transparent hover:bg-cyan-400 cursor-col-resize transition-colors"
        onMouseDown={handleMouseDown}
      />
    </div>
  );
}
