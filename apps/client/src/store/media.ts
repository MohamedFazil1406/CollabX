import { create } from "zustand";

interface MediaState {
  localStream: MediaStream | null;

  remoteStreams: Record<string, MediaStream>;

  cameraEnabled: boolean;

  microphoneEnabled: boolean;

  speakersEnabled: boolean;

  setLocalStream: (stream: MediaStream | null) => void;

  addRemoteStream: (userId: string, stream: MediaStream) => void;

  removeRemoteStream: (userId: string) => void;

  clearRemoteStreams: () => void;

  setCameraEnabled: (enabled: boolean) => void;

  setMicrophoneEnabled: (enabled: boolean) => void;

  setSpeakersEnabled: (enabled: boolean) => void;
}

export const useMediaStore = create<MediaState>((set) => ({
  localStream: null,

  remoteStreams: {},

  cameraEnabled: true,

  microphoneEnabled: true,

  speakersEnabled: true,

  setLocalStream: (stream) =>
    set({
      localStream: stream,
    }),

  addRemoteStream: (userId, stream) =>
    set((state) => ({
      remoteStreams: {
        ...state.remoteStreams,
        [userId]: stream,
      },
    })),

  removeRemoteStream: (userId) =>
    set((state) => {
      const streams = { ...state.remoteStreams };

      delete streams[userId];

      return {
        remoteStreams: streams,
      };
    }),

  clearRemoteStreams: () =>
    set({
      remoteStreams: {},
    }),

  setCameraEnabled: (enabled) =>
    set({
      cameraEnabled: enabled,
    }),

  setMicrophoneEnabled: (enabled) =>
    set({
      microphoneEnabled: enabled,
    }),

  setSpeakersEnabled: (enabled) =>
    set({
      speakersEnabled: enabled,
    }),
}));
