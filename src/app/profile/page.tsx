"use client";

import React, { useState, useEffect } from "react";
import { User, Camera, Save, X, Edit3, Mail, Shield } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Image from "next/image";
import { motion } from "framer-motion";

interface UserProfile {
  uid: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  createdAt?: string;
}

export default function Profile() {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({ name: "", bio: "" });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) await fetchProfile(user);
      else setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const fetchProfile = async (user: FirebaseUser) => {
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data() as UserProfile;
        setProfile(data);
        setFormData({ name: data.name || "", bio: data.bio || "" });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setPreviewAvatar(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data.url;
  };

  const saveProfile = async () => {
    if (!currentUser) return;
    setSaving(true);

    try {
      let avatarUrl = profile?.avatar;

      if (avatarFile) {
        avatarUrl = await uploadToCloudinary(avatarFile);
      }

      const updatedData = {
        name: formData.name,
        bio: formData.bio,
        avatar: avatarUrl,
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(doc(db, "users", currentUser.uid), updatedData);

      setProfile((prev) => (prev ? { ...prev, ...updatedData } : null));
      setAvatarFile(null);
      setPreviewAvatar(null);
      setIsEditing(false);

      alert("✅ Profile updated successfully!");
    } catch (error) {
      console.error(error);
      alert("❌ Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setAvatarFile(null);
    setPreviewAvatar(null);
    if (profile) setFormData({ name: profile.name, bio: profile.bio || "" });
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center font-mono">
      <div className="w-16 h-16 border-t-2 border-cyan-400 rounded-full animate-spin mb-4" />
      <span className="text-cyan-400 tracking-[4px] uppercase text-xs font-bold animate-pulse">Syncing Node...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-transparent text-white font-mono pt-32 pb-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#3b82f620_0%,transparent_50%)] z-0 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-end mb-12"
        >
          <div>
            <div className="inline-flex px-4 py-1 border border-cyan-400/30 bg-cyan-400/5 rounded-full mb-4 text-[10px] font-bold tracking-[3px] uppercase text-cyan-300">
              Identity Matrix
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tighter bg-gradient-to-r from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent">
              NEURAL PROFILE
            </h1>
            <p className="text-zinc-500 mt-2 tracking-[1px] text-sm">Configure your dimensional presence.</p>
          </div>

          {!isEditing ? (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)} 
              className="flex items-center gap-3 px-6 py-3 bg-zinc-900/50 hover:bg-zinc-800 border border-white/10 hover:border-cyan-400/50 rounded-2xl transition-all shadow-[0_0_15px_rgba(34,211,238,0.1)] text-sm font-bold uppercase tracking-[1px]"
            >
              <Edit3 className="w-4 h-4 text-cyan-400" /> Reconfigure
            </motion.button>
          ) : (
            <div className="flex gap-4">
              <button onClick={cancelEdit} className="flex items-center gap-2 px-6 py-3 border border-red-500/30 hover:bg-red-500/10 text-red-400 rounded-2xl text-xs font-bold tracking-[1px] uppercase transition-all">
                <X className="w-4 h-4" /> Abort
              </button>
              <button onClick={saveProfile} disabled={saving} className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-black rounded-2xl text-xs font-bold tracking-[1px] uppercase shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all disabled:opacity-50">
                <Save className="w-4 h-4" /> {saving ? "Writing..." : "Commit"}
              </button>
            </div>
          )}
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Avatar Card */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-1"
          >
            <div className="bg-zinc-950/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center relative overflow-hidden group hover:border-cyan-400/30 transition-colors shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative w-40 h-40 mx-auto mb-8">
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-cyan-400/50 shadow-[0_0_30px_rgba(34,211,238,0.2)] p-1 bg-black">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    {(previewAvatar || profile?.avatar) ? (
                      <Image src={previewAvatar || profile!.avatar!} alt="Profile" width={160} height={160} className="object-cover w-full h-full" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center">
                        <User className="w-16 h-16 text-zinc-600" />
                      </div>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <label className="absolute bottom-2 right-2 bg-black border border-cyan-500 rounded-full p-3 cursor-pointer hover:bg-cyan-900/30 transition-colors shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                    <Camera className="w-5 h-5 text-cyan-400" />
                    <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                  </label>
                )}
              </div>

              <h3 className="font-bold text-2xl tracking-tight mb-2 text-white">{profile?.name}</h3>
              <p className="text-zinc-500 text-xs font-bold tracking-[1px] flex items-center justify-center gap-2 uppercase">
                <Shield className="w-3 h-3 text-emerald-400" /> Verified Node
              </p>
            </div>
          </motion.div>

          {/* Info Card */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-2 space-y-8"
          >
            <div className="bg-zinc-950/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden group hover:border-blue-400/30 transition-colors">
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <h4 className="text-sm font-bold tracking-[2px] uppercase text-zinc-400 mb-8 flex items-center gap-3 border-b border-white/10 pb-4">
                <User className="w-5 h-5 text-blue-400" /> Core Parameters
              </h4>

              <div className="space-y-8">
                <div>
                  <label className="block text-xs font-bold tracking-[2px] uppercase text-zinc-600 mb-3">Alias Designation</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={formData.name} 
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                      className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 focus:border-cyan-400 outline-none transition-colors text-white focus:shadow-[0_0_20px_rgba(34,211,238,0.1)]" 
                    />
                  ) : (
                    <p className="text-2xl font-light text-white tracking-tight">{profile?.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-[2px] uppercase text-zinc-600 mb-3">Node Address</label>
                  <div className="flex items-center gap-3 text-zinc-300 bg-black/30 px-5 py-4 rounded-2xl border border-white/5">
                    <Mail className="w-5 h-5 text-zinc-500" />
                    <span className="font-light">{profile?.email}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-[2px] uppercase text-zinc-600 mb-3">Neural Biography</label>
                  {isEditing ? (
                    <textarea 
                      value={formData.bio} 
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })} 
                      rows={4} 
                      className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 focus:border-cyan-400 outline-none transition-colors text-white resize-y focus:shadow-[0_0_20px_rgba(34,211,238,0.1)]" 
                      placeholder="Input dimensional backstory..."
                    />
                  ) : (
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                      <p className="text-zinc-400 leading-relaxed font-light">{profile?.bio || "No data recorded in this sector."}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}