"use client";

import { useEffect, useRef } from "react";

interface RemoteVideoProps {
  userId: string;
  stream: MediaStream;
}

export default function RemoteVideo({ userId, stream }: RemoteVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    videoRef.current.srcObject = stream;
  }, [stream]);

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 shadow-lg">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="aspect-video w-full object-cover"
      />

      <div className="bg-zinc-800 px-3 py-2 text-sm font-medium text-white">
        {userId}
      </div>
    </div>
  );
}
