"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Mic, MicOff, PhoneOff } from "lucide-react";
import { db } from "@/lib/firebase";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

interface ChatUser {
  uid: string;
  displayName?: string | null;
  email?: string | null;
  name?: string | null;
}

interface CallData {
  id?: string;
  callerId: string;
  callerName?: string;
  status: "ringing" | "accepted" | "ended";
  offer?: RTCSessionDescriptionInit;
  answer?: RTCSessionDescriptionInit;
  iceCandidates?: RTCIceCandidateInit[];
}

interface VoiceCallProps {
  currentUser: ChatUser | null;
  selectedUser: ChatUser | null;
  isOpen: boolean;
  onClose: () => void;
  incomingCall?: CallData | null;
  onCallAccepted?: () => void;
  onCallEnded?: () => void;
}

const serializeDescription = (
  description: RTCSessionDescriptionInit,
): RTCSessionDescriptionInit => ({
  type: description.type,
  sdp: description.sdp,
});

export default function VoiceCall({
  currentUser,
  selectedUser,
  isOpen,
  onClose,
  incomingCall: initialIncomingCall,
  onCallAccepted,
  onCallEnded,
}: VoiceCallProps) {
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasLocalAudio, setHasLocalAudio] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [incomingCall, setIncomingCall] = useState<CallData | null>(null);

  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const callTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const callDocIdRef = useRef<string | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const pendingIceCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
  const pendingRemoteIceCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
  const receivedIceCandidatesRef = useRef<Set<string>>(new Set());

  const currentUserId = currentUser?.uid ?? "";
  const selectedUserId = selectedUser?.uid ?? "";
  const chatId = useMemo(() => {
    if (!currentUserId || !selectedUserId) return "";
    return [currentUserId, selectedUserId].sort().join("_");
  }, [currentUserId, selectedUserId]);

  function cleanupCall() {
    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;

    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;

    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = null;
    }
    remoteStreamRef.current = null;

    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }

    pendingIceCandidatesRef.current = [];
    pendingRemoteIceCandidatesRef.current = [];
    receivedIceCandidatesRef.current.clear();

    setIsInCall(false);
    setIsMuted(false);
    setHasLocalAudio(false);
    setIncomingCall(null);
    setCallDuration(0);
    callDocIdRef.current = null;
  }

  async function addIceCandidateToCall(candidate: RTCIceCandidateInit) {
    if (!chatId || !callDocIdRef.current) return;

    await setDoc(
      doc(db, "chats", chatId, "calls", callDocIdRef.current),
      { iceCandidates: arrayUnion(candidate) },
      { merge: true },
    );
  }

  async function flushPendingIceCandidates() {
    const candidates = [...pendingIceCandidatesRef.current];
    pendingIceCandidatesRef.current = [];
    await Promise.all(
      candidates.map((candidate) => addIceCandidateToCall(candidate)),
    );
  }

  async function addRemoteIceCandidate(candidate: RTCIceCandidateInit) {
    const candidateKey = JSON.stringify(candidate);
    if (receivedIceCandidatesRef.current.has(candidateKey)) return;

    const pc = peerConnectionRef.current;
    if (!pc) return;

    // Only add if we have a remote description (or are close to it)
    if (!pc.remoteDescription) {
      pendingRemoteIceCandidatesRef.current.push(candidate);
      return;
    }

    try {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
      receivedIceCandidatesRef.current.add(candidateKey);
    } catch (error) {
      // Ignore common errors with duplicate / already added candidates
      if (!String(error).includes("UnknownError") && !String(error).includes("InvalidState")) {
        console.error("Failed to add ICE candidate", error);
      }
    }
  }

  async function flushPendingRemoteIceCandidates() {
    const candidates = [...pendingRemoteIceCandidatesRef.current];
    pendingRemoteIceCandidatesRef.current = [];

    for (const candidate of candidates) {
      await addRemoteIceCandidate(candidate);
    }
  }

  function attachRemoteStream(stream: MediaStream) {
    remoteStreamRef.current = stream;
    if (!remoteAudioRef.current) {
      console.warn("Remote audio element not ready yet");
      return;
    }

    remoteAudioRef.current.srcObject = stream;
    remoteAudioRef.current.play().catch((err) => {
      console.warn("Remote audio playback blocked:", err);
    });
  }

  function createPeerConnection() {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
        { urls: "stun:stun.stunprotocol.org:3478" },
      ],
      iceCandidatePoolSize: 10,
    });

    pc.onicecandidate = (event) => {
      if (!event.candidate) return;

      const candidate = event.candidate.toJSON();
      if (!callDocIdRef.current) {
        pendingIceCandidatesRef.current.push(candidate);
        return;
      }

      void addIceCandidateToCall(candidate);
    };

    pc.ontrack = (event) => {
      const remoteStream = event.streams[0] || new MediaStream([event.track]);
      if (!remoteStream) return;
      attachRemoteStream(remoteStream);
    };

    // Helpful for debugging connectivity
    pc.oniceconnectionstatechange = () => {
      console.log("ICE connection state:", pc.iceConnectionState);
    };
    pc.onconnectionstatechange = () => {
      console.log("Peer connection state:", pc.connectionState);
    };

    return pc;
  }

  function startTimer() {
    if (callTimerRef.current) clearInterval(callTimerRef.current);
    setCallDuration(0);
    callTimerRef.current = setInterval(() => {
      setCallDuration((duration) => duration + 1);
    }, 1000);
  }

  async function startOutgoingCall() {
    if (!chatId || !currentUserId) return;

    let stream: MediaStream | null = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      console.warn("No microphone available, continuing in listen-only mode");
    }

    const pc = createPeerConnection();
    peerConnectionRef.current = pc;

    if (stream) {
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      localStreamRef.current = stream;
      setHasLocalAudio(true);
    }

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    const callDoc = await addDoc(collection(db, "chats", chatId, "calls"), {
      callerId: currentUserId,
      callerName:
        currentUser?.displayName || currentUser?.email?.split("@")[0] || "User",
      status: "ringing",
      offer: serializeDescription(offer),
      createdAt: serverTimestamp(),
    });

    callDocIdRef.current = callDoc.id;
    await flushPendingIceCandidates();
    setIsInCall(true);
    startTimer();
  }

  async function acceptIncomingCall() {
    if (!chatId || !incomingCall?.id || !incomingCall.offer) return;

    let stream: MediaStream | null = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      console.warn("No microphone, joining as listener only");
    }

    const pc = createPeerConnection();
    peerConnectionRef.current = pc;

    if (stream) {
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      localStreamRef.current = stream;
      setHasLocalAudio(true);
    }

    await pc.setRemoteDescription(new RTCSessionDescription(incomingCall.offer));
    await flushPendingRemoteIceCandidates();

    // Add any candidates that came with the initial call data
    if (incomingCall.iceCandidates?.length) {
      for (const candidate of incomingCall.iceCandidates) {
        await addRemoteIceCandidate(candidate);
      }
    }

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    await setDoc(
      doc(db, "chats", chatId, "calls", incomingCall.id),
      {
        status: "accepted",
        answer: serializeDescription(answer),
      },
      { merge: true },
    );

    callDocIdRef.current = incomingCall.id;
    await flushPendingIceCandidates();
    setIsInCall(true);
    setIncomingCall(null);
    startTimer();
    onCallAccepted?.();
  }

  async function endCall() {
    if (chatId && callDocIdRef.current) {
      await setDoc(
        doc(db, "chats", chatId, "calls", callDocIdRef.current),
        {
          status: "ended",
          endedAt: serverTimestamp(),
        },
        { merge: true },
      );
    }

    cleanupCall();
    onCallEnded?.();
    onClose();
  }

  useEffect(() => {
    if (!chatId || !isOpen || !currentUserId) return;

    const callsRef = collection(db, "chats", chatId, "calls");
    const unsubscribe = onSnapshot(callsRef, async (snapshot) => {
      // Process changes sequentially to avoid race conditions
      for (const change of snapshot.docChanges()) {
        const data = change.doc.data() as CallData;
        const callId = change.doc.id;

        if (callDocIdRef.current && callId !== callDocIdRef.current) continue;

        if (data.status === "ended") {
          cleanupCall();
          onCallEnded?.();
          onClose();
          continue;
        }

        if (data.offer && data.callerId !== currentUserId && !peerConnectionRef.current) {
          setIncomingCall({ ...data, id: callId });
          callDocIdRef.current = callId;
        }

        // Handle answer (for caller)
        if (data.answer && peerConnectionRef.current?.localDescription) {
          const pc = peerConnectionRef.current;
          if (!pc.currentRemoteDescription) {
            try {
              await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
              await flushPendingRemoteIceCandidates();
            } catch (error) {
              console.error("Failed to set remote answer", error);
            }
          }
        }

        // Handle ICE candidates
        if (data.iceCandidates?.length && peerConnectionRef.current) {
          for (const candidate of data.iceCandidates) {
            await addRemoteIceCandidate(candidate);
          }
        }
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId, currentUserId, isOpen, onCallEnded, onClose]);

  useEffect(() => {
    if (initialIncomingCall?.id) {
      setIncomingCall(initialIncomingCall);
      callDocIdRef.current = initialIncomingCall.id;
    }
  }, [initialIncomingCall]);

  useEffect(() => {
    if (isOpen && !initialIncomingCall && !isInCall) {
      void startOutgoingCall();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialIncomingCall, isInCall]);

  useEffect(() => cleanupCall, []);

  // Re-attach remote stream whenever isInCall becomes true or stream updates
  useEffect(() => {
    if (isInCall && remoteStreamRef.current) {
      attachRemoteStream(remoteStreamRef.current);
    }
  }, [isInCall]);

  const formatTime = (seconds: number) =>
    `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`;

  if (!isOpen) return null;

  return (
    <>
      {isInCall && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center font-mono backdrop-blur-xl bg-[radial-gradient(ellipse_at_center,#1e1b4b_0%,#000_100%)]">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
          
          <div className="w-32 h-32 rounded-full border-2 border-cyan-400/50 flex items-center justify-center mb-8 relative">
             <div className="absolute inset-0 rounded-full border border-cyan-400 animate-ping opacity-20" />
             <Mic className="w-12 h-12 text-cyan-400 animate-pulse" />
          </div>

          <h2 className="text-4xl font-bold tracking-tighter mb-4 text-white drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">{selectedUser?.name}</h2>
          <p className="text-cyan-400 font-bold tracking-[2px] mb-12 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            SECURE LINK ACTIVE [{formatTime(callDuration)}]
          </p>

          <div className="flex gap-8">
            <button
              onClick={() => {
                if (!localStreamRef.current) return;

                const nextMuted = !isMuted;
                localStreamRef.current
                  .getAudioTracks()
                  .forEach((track) => {
                    track.enabled = !nextMuted;
                  });
                setIsMuted(nextMuted);
              }}
              disabled={!hasLocalAudio}
              className={`p-6 rounded-full border transition-all ${isMuted ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500 hover:text-black shadow-[0_0_20px_rgba(34,211,238,0.2)]'} disabled:opacity-30`}
            >
              {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>

            <button onClick={endCall} className="p-6 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-colors">
              <PhoneOff className="w-6 h-6" />
            </button>
          </div>

          {!hasLocalAudio && (
            <p className="text-yellow-400 mt-8 text-xs font-bold tracking-[1px] uppercase bg-yellow-400/10 px-4 py-2 rounded-full border border-yellow-400/30">
              Microphone offline (Listen-only mode)
            </p>
          )}

          {/* Audio element always rendered when in call for better timing */}
          <audio ref={remoteAudioRef} autoPlay playsInline />
        </div>
      )}

      {!isInCall && incomingCall && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center font-mono">
          <div className="bg-zinc-950/90 border border-cyan-500/30 p-8 rounded-3xl text-center shadow-[0_0_50px_rgba(34,211,238,0.1)] max-w-sm w-full">
            <div className="w-20 h-20 mx-auto rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/50 mb-6 relative">
               <div className="absolute inset-0 rounded-full border border-cyan-400 animate-ping opacity-30" />
               <PhoneOff className="w-8 h-8 text-cyan-400 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold tracking-tighter mb-2 text-white">
              {incomingCall.callerName || "Unknown Node"}
            </h3>
            <p className="text-cyan-400 text-xs font-bold tracking-[2px] uppercase mb-8">
              Incoming Transmission...
            </p>

            <div className="flex gap-4">
              <button
                onClick={endCall}
                className="flex-1 py-4 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white rounded-2xl text-xs font-bold tracking-[2px] uppercase transition-all"
              >
                Reject
              </button>

              <button
                onClick={acceptIncomingCall}
                className="flex-1 py-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-black rounded-2xl text-xs font-bold tracking-[2px] uppercase transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]"
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