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
  const pendingIceCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
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

    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }

    pendingIceCandidatesRef.current = [];
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
    const candidates = pendingIceCandidatesRef.current;
    pendingIceCandidatesRef.current = [];
    await Promise.all(candidates.map((candidate) => addIceCandidateToCall(candidate)));
  }

  function createPeerConnection() {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
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
      const remoteStream = event.streams[0];
      if (!remoteAudioRef.current || !remoteStream) return;

      remoteAudioRef.current.srcObject = remoteStream;
      remoteAudioRef.current.play().catch(() => {
        console.warn("Remote audio playback was blocked by the browser");
      });
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
    const unsubscribe = onSnapshot(callsRef, (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        const data = change.doc.data() as CallData;
        const callId = change.doc.id;

        if (callDocIdRef.current && callId !== callDocIdRef.current) return;

        if (data.status === "ended") {
          cleanupCall();
          onCallEnded?.();
          onClose();
          return;
        }

        if (data.offer && data.callerId !== currentUserId && !peerConnectionRef.current) {
          setIncomingCall({ ...data, id: callId });
          callDocIdRef.current = callId;
        }

        if (data.answer && peerConnectionRef.current?.localDescription) {
          const pc = peerConnectionRef.current;
          if (!pc.currentRemoteDescription) {
            try {
              await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
            } catch (error) {
              console.error("Failed to set remote answer", error);
            }
          }
        }

        if (data.iceCandidates && peerConnectionRef.current) {
          for (const candidate of data.iceCandidates) {
            const candidateKey = JSON.stringify(candidate);
            if (receivedIceCandidatesRef.current.has(candidateKey)) continue;

            try {
              await peerConnectionRef.current.addIceCandidate(
                new RTCIceCandidate(candidate),
              );
              receivedIceCandidatesRef.current.add(candidateKey);
            } catch (error) {
              console.error("Failed to add ICE candidate", error);
            }
          }
        }
      });
    });

    return () => unsubscribe();
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
    // startOutgoingCall is intentionally driven by the modal opening.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialIncomingCall, isInCall]);

  useEffect(() => cleanupCall, []);

  const formatTime = (seconds: number) =>
    `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`;

  if (!isOpen) return null;

  return (
    <>
      {isInCall && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center">
          <h2 className="text-2xl mb-2">{selectedUser?.name}</h2>
          <p className="text-green-400 mb-6">{formatTime(callDuration)}</p>

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
              className="p-5 bg-zinc-800 rounded-full disabled:opacity-50"
            >
              {isMuted ? <MicOff /> : <Mic />}
            </button>

            <button onClick={endCall} className="p-5 bg-red-600 rounded-full">
              <PhoneOff />
            </button>
          </div>

          {!hasLocalAudio && (
            <p className="text-yellow-400 mt-2 text-sm">
              Microphone not available (Listen-only mode)
            </p>
          )}

          <audio ref={remoteAudioRef} autoPlay playsInline controls />
        </div>
      )}

      {!isInCall && incomingCall && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <div className="bg-zinc-900 p-8 rounded-2xl text-center">
            <h3 className="text-xl mb-4">
              {incomingCall.callerName || "Someone"} is calling...
            </h3>

            <div className="flex gap-4">
              <button
                onClick={endCall}
                className="px-6 py-3 bg-zinc-700 rounded-xl"
              >
                Decline
              </button>

              <button
                onClick={acceptIncomingCall}
                className="px-6 py-3 bg-green-600 rounded-xl"
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
