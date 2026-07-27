"use client";

import { useEffect, useRef } from "react";

import { socket } from "@/socket/client";
import { useMediaStore } from "@/store/media";

import { StreamServiceMsg } from "@collabx/types";

export default function LocalVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const { localStream, setLocalStream } = useMediaStore();

  useEffect(() => {
    let stream: MediaStream;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        setLocalStream(stream);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        socket.emit(StreamServiceMsg.STREAM_READY);
      } catch (error) {
        console.error("Failed to access camera:", error);
      }
    };

    startCamera();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [setLocalStream]);

  useEffect(() => {
    if (!videoRef.current || !localStream) return;

    videoRef.current.srcObject = localStream;
  }, [localStream]);

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="aspect-video w-full object-cover"
      />

      <div className="bg-zinc-800 px-3 py-2 text-sm font-medium text-white">
        You
      </div>
    </div>
  );
}
