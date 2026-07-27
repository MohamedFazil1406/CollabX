"use client";

import { useWebRTC } from "@/hooks/useWebRTC";
import { useMediaStore } from "@/store/media";

import LocalVideo from "./LocalVideo";
import RemoteVideo from "./RemoteVideo";
import CallControls from "./CallControls";

export default function VideoGrid() {
  // Initialize WebRTC
  useWebRTC();

  const { remoteStreams } = useMediaStore();

  return (
    <div className="flex h-full flex-col gap-4">
      <LocalVideo />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(remoteStreams).map(([userId, stream]) => (
          <RemoteVideo key={userId} userId={userId} stream={stream} />
        ))}
      </div>

      <CallControls />
    </div>
  );
}
