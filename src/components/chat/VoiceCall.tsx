"use client";

import React, { useState, useEffect, useRef } from "react";
import { Phone, PhoneOff, Mic, MicOff } from "lucide-react";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  setDoc,
  addDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

interface VoiceCallProps {
  currentUser: any;
  selectedUser: any;
  isOpen: boolean;
  onClose: () => void;
  incomingCall?: any;
  onCallAccepted?: () => void;
  onCallEnded?: () => void;
}

interface CallData {
  callerId: string;
  callerName: string;
  status: "ringing" | "accepted" | "ended";
  offer?: RTCSessionDescriptionInit;
  answer?: RTCSessionDescriptionInit;
}

export default function VoiceCall({
  currentUser,
  selectedUser,
  isOpen,
  onClose,
  incomingCall,
  onCallAccepted,
  onCallEnded,
}: VoiceCallProps) {
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isRinging, setIsRinging] = useState(!!incomingCall);

  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);
  const callDocIdRef = useRef<string | null>(null);

  const chatId = React.useMemo(() => {
    if (!currentUser?.uid || !selectedUser?.uid) return "";
    return [currentUser.uid, selectedUser.uid].sort().join("_");
  }, [currentUser, selectedUser]);

  // Listen for call updates (ICE candidates, status changes, etc.)
  useEffect(() => {
    if (!chatId || !isOpen) return;

    const callsRef = collection(db, "chats", chatId, "calls");
    const unsubscribe = onSnapshot(callsRef, (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        const data = change.doc.data() as CallData;
        const callId = change.doc.id;

        if (data.status === "ended") {
          endCall();
        } else if (data.answer && peerConnectionRef.current) {
          try {
            await peerConnectionRef.current.setRemoteDescription(
              new RTCSessionDescription(data.answer)
            );
          } catch (e) {
            console.error("Failed to set remote answer", e);
          }
        }
      });
    });

    return () => unsubscribe();
  }, [chatId, isOpen]);

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.onicecandidate = async (event) => {
      if (event.candidate && callDocIdRef.current) {
        await setDoc(
          doc(db, "chats", chatId, "calls", callDocIdRef.current),
          { iceCandidate: event.candidate.toJSON() },
          { merge: true }
        );
      }
    };

    pc.ontrack = (event) => {
      if (remoteAudioRef.current && event.streams[0]) {
        remoteAudioRef.current.srcObject = event.streams[0];
      }
    };

    return pc;
  };

  const startOutgoingCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = stream;

      const pc = createPeerConnection();
      peerConnectionRef.current = pc;

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const callDoc = await addDoc(collection(db, "chats", chatId, "calls"), {
        callerId: currentUser.uid,
        callerName: currentUser.displayName || currentUser.email?.split("@")[0] || "You",
        status: "ringing",
        offer: { type: offer.type, sdp: offer.sdp },
        createdAt: serverTimestamp(),
      });

      callDocIdRef.current = callDoc.id;
      setIsInCall(true);
      setIsRinging(false);
      startCallTimer();
    } catch (error) {
      console.error("Failed to start call:", error);
      alert("Failed to access microphone. Please check permissions.");
      onClose();
    }
  };

  const acceptIncomingCall = async () => {
    if (!incomingCall) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = stream;

      const pc = createPeerConnection();
      peerConnectionRef.current = pc;

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      if (incomingCall.offer) {
        await pc.setRemoteDescription(new RTCSessionDescription(incomingCall.offer));
      }

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      await setDoc(
        doc(db, "chats", chatId, "calls", incomingCall.id || callDocIdRef.current!),
        {
          status: "accepted",
          answer: { type: answer.type, sdp: answer.sdp },
        },
        { merge: true }
      );

      setIsInCall(true);
      setIsRinging(false);
      startCallTimer();
      onCallAccepted?.();
    } catch (error) {
      console.error("Failed to accept call:", error);
      rejectCall();
    }
  };

  const rejectCall = async () => {
    if (callDocIdRef.current) {
      await setDoc(
        doc(db, "chats", chatId, "calls", callDocIdRef.current),
        { status: "ended" },
        { merge: true }
      );
    }
    onClose();
  };

  const endCall = async () => {
    if (callDocIdRef.current) {
      await setDoc(
        doc(db, "chats", chatId, "calls", callDocIdRef.current),
        { status: "ended" },
        { merge: true }
      );
    }
    cleanupCall();
    onCallEnded?.();
    onClose();
  };

  const cleanupCall = () => {
    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;

    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;

    if (remoteAudioRef.current) remoteAudioRef.current.srcObject = null;

    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }

    setIsInCall(false);
    setCallDuration(0);
    setIsMuted(false);
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach((track) => (track.enabled = !track.enabled));
      setIsMuted((prev) => !prev);
    }
  };

  const startCallTimer = () => {
    if (callTimerRef.current) clearInterval(callTimerRef.current);
    setCallDuration(0);
    callTimerRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Auto-start call if opened without incoming call
  useEffect(() => {
    if (isOpen && !incomingCall && !isInCall) {
      startOutgoingCall();
    }
  }, [isOpen, incomingCall]);

  // Cleanup on unmount
  useEffect(() => {
    return () => cleanupCall();
  }, []);

  if (!isOpen) return null;

  return (
    <>
      {/* Active Call Screen */}
      {isInCall && (
        <div className="fixed inset-0 bg-black/95 z-[70] flex flex-col items-center justify-center">
          <div className="text-center">
            <div className="w-28 h-28 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-full mx-auto flex items-center justify-center mb-6">
              <Phone className="w-14 h-14 text-white" />
            </div>
            <h2 className="text-3xl font-semibold mb-2">{selectedUser?.name}</h2>
            <p className="text-emerald-400 text-xl mb-10">
              {formatDuration(callDuration)}
            </p>

            <div className="flex items-center gap-12">
              <button
                onClick={toggleMute}
                className={`p-6 rounded-full transition-all ${
                  isMuted ? "bg-red-500/20 text-red-400" : "bg-zinc-800 hover:bg-zinc-700"
                }`}
              >
                {isMuted ? <MicOff size={36} /> : <Mic size={36} />}
              </button>

              <button
                onClick={endCall}
                className="p-6 bg-red-600 hover:bg-red-700 rounded-full transition-all"
              >
                <PhoneOff size={36} />
              </button>
            </div>
          </div>

          <audio ref={remoteAudioRef} autoPlay />
        </div>
      )}

      {/* Incoming Call Modal */}
      {isRinging && incomingCall && (
        <div className="fixed inset-0 bg-black/90 z-[80] flex items-center justify-center">
          <div className="bg-zinc-900 rounded-3xl p-10 text-center w-full max-w-sm mx-4">
            <div className="mx-auto w-24 h-24 bg-zinc-700 rounded-full flex items-center justify-center text-5xl mb-6">
              {incomingCall.callerName?.[0]?.toUpperCase() || "?"}
            </div>
            <h3 className="text-2xl font-semibold mb-1">
              {incomingCall.callerName}
            </h3>
            <p className="text-gray-400 mb-8">Incoming voice call...</p>

            <div className="flex gap-4">
              <button
                onClick={rejectCall}
                className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 rounded-2xl font-medium"
              >
                Decline
              </button>
              <button
                onClick={acceptIncomingCall}
                className="flex-1 py-4 bg-green-600 hover:bg-green-500 rounded-2xl font-medium"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}