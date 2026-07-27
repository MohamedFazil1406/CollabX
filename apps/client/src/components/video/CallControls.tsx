"use client";

import { Camera, CameraOff, Mic, MicOff, Volume2, VolumeX } from "lucide-react";

import { socket } from "@/socket/client";
import { useMediaStore } from "@/store/media";

import { StreamServiceMsg } from "@collabx/types";

export default function CallControls() {
  const {
    localStream,
    cameraEnabled,
    microphoneEnabled,
    speakersEnabled,
    setCameraEnabled,
    setMicrophoneEnabled,
    setSpeakersEnabled,
  } = useMediaStore();

  const toggleCamera = () => {
    if (!localStream) return;

    const enabled = !cameraEnabled;

    localStream.getVideoTracks().forEach((track) => {
      track.enabled = enabled;
    });

    setCameraEnabled(enabled);

    if (!enabled) {
      socket.emit(StreamServiceMsg.CAMERA_OFF);
    } else {
      socket.emit(StreamServiceMsg.STREAM_READY);
    }
  };

  const toggleMicrophone = () => {
    if (!localStream) return;

    const enabled = !microphoneEnabled;

    localStream.getAudioTracks().forEach((track) => {
      track.enabled = enabled;
    });

    setMicrophoneEnabled(enabled);

    socket.emit(StreamServiceMsg.MIC_STATE, enabled);
  };

  const toggleSpeakers = () => {
    const enabled = !speakersEnabled;

    document.querySelectorAll("video").forEach((video) => {
      if (!video.muted) {
        video.muted = !enabled;
      }
    });

    setSpeakersEnabled(enabled);

    socket.emit(StreamServiceMsg.SPEAKER_STATE, enabled);
  };

  return (
    <div className="flex items-center justify-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
      <button
        onClick={toggleMicrophone}
        className="rounded-full bg-zinc-800 p-3 transition hover:bg-zinc-700"
      >
        {microphoneEnabled ? <Mic size={20} /> : <MicOff size={20} />}
      </button>

      <button
        onClick={toggleCamera}
        className="rounded-full bg-zinc-800 p-3 transition hover:bg-zinc-700"
      >
        {cameraEnabled ? <Camera size={20} /> : <CameraOff size={20} />}
      </button>

      <button
        onClick={toggleSpeakers}
        className="rounded-full bg-zinc-800 p-3 transition hover:bg-zinc-700"
      >
        {speakersEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>
    </div>
  );
}
