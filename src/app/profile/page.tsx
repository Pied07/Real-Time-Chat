"use client";

import React, { useState, useEffect } from "react";
import { User, Camera, Save, X, Edit3, Mail, Shield } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Image from "next/image";

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

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white mt-20 pb-6">
      <div className="pt-24 max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-5xl font-bold tracking-tighter">Your Profile</h1>
            <p className="text-gray-400 mt-2">Manage how others see you in Pulse</p>
          </div>

          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl">
              <Edit3 className="w-5 h-5" /> Edit Profile
            </button>
          ) : (
            <div className="flex gap-3">
              <button onClick={cancelEdit} className="flex items-center gap-2 px-6 py-3 border border-white/10 hover:bg-white/5 rounded-2xl">
                <X className="w-5 h-5" /> Cancel
              </button>
              <button onClick={saveProfile} disabled={saving} className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl font-semibold">
                <Save className="w-5 h-5" /> {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Avatar */}
          <div className="md:col-span-1">
            <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-8 text-center">
              <div className="relative w-40 h-40 mx-auto mb-6">
                <div className="w-full h-full rounded-3xl overflow-hidden border-4 border-white/10">
                  {(previewAvatar || profile?.avatar) ? (
                    <Image src={previewAvatar || profile!.avatar!} alt="Profile" width={160} height={160} className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                      <User className="w-20 h-20 text-gray-500" />
                    </div>
                  )}
                </div>

                {isEditing && (
                  <label className="absolute bottom-2 right-2 bg-black border border-white/20 rounded-2xl p-3 cursor-pointer hover:bg-zinc-900">
                    <Camera className="w-5 h-5" />
                    <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                  </label>
                )}
              </div>

              <h3 className="font-semibold text-2xl mb-1">{profile?.name}</h3>
              <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" /> {profile?.email}
              </p>
            </div>
          </div>

          {/* Info */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-8">
              <h4 className="text-lg font-semibold mb-6 flex items-center gap-3">
                <User className="w-5 h-5 text-violet-400" /> Basic Information
              </h4>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Display Name</label>
                  {isEditing ? (
                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-zinc-950 border border-white/10 rounded-2xl px-5 py-4" />
                  ) : (
                    <p className="text-xl font-medium">{profile?.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Bio</label>
                  {isEditing ? (
                    <textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} rows={5} className="w-full bg-zinc-950 border border-white/10 rounded-2xl px-5 py-4" />
                  ) : (
                    <p className="text-gray-300 leading-relaxed">{profile?.bio || "No bio added yet."}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}