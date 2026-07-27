"use client";

import { useEffect, useRef } from "react";
import Peer, { SignalData } from "simple-peer";

import { socket } from "@/socket/client";
import { useMediaStore } from "@/store/media";

import { StreamServiceMsg } from "@collabx/types";

type PeerMap = Record<string, Peer.Instance>;

export function useWebRTC() {
  const peers = useRef<PeerMap>({});

  const { localStream, addRemoteStream, removeRemoteStream } = useMediaStore();

  useEffect(() => {
    if (!localStream) return;

    /**
     * Existing user creates an offer for the new user.
     */
    const handleUserReady = (userID: string) => {
      if (peers.current[userID]) return;

      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: localStream,
      });

      peer.on("signal", (signal: SignalData) => {
        socket.emit(StreamServiceMsg.SIGNAL, {
          targetUserID: userID,
          signal,
        });
      });

      peer.on("stream", (stream) => {
        addRemoteStream(userID, stream);
      });

      peer.on("close", () => {
        removeRemoteStream(userID);
        delete peers.current[userID];
      });

      peer.on("error", console.error);

      peers.current[userID] = peer;
    };

    /**
     * Receive offer/answer.
     */
    const handleSignal = ({
      userID,
      signal,
    }: {
      userID: string;
      signal: SignalData;
    }) => {
      let peer = peers.current[userID];

      if (!peer) {
        peer = new Peer({
          initiator: false,
          trickle: false,
          stream: localStream,
        });

        peer.on("signal", (answer: SignalData) => {
          socket.emit(StreamServiceMsg.SIGNAL, {
            targetUserID: userID,
            signal: answer,
          });
        });

        peer.on("stream", (stream) => {
          addRemoteStream(userID, stream);
        });

        peer.on("close", () => {
          removeRemoteStream(userID);
          delete peers.current[userID];
        });

        peer.on("error", console.error);

        peers.current[userID] = peer;
      }

      peer.signal(signal);
    };

    socket.on(StreamServiceMsg.USER_READY, handleUserReady);
    socket.on(StreamServiceMsg.SIGNAL, handleSignal);

    return () => {
      socket.off(StreamServiceMsg.USER_READY, handleUserReady);
      socket.off(StreamServiceMsg.SIGNAL, handleSignal);

      Object.values(peers.current).forEach((peer) => peer.destroy());

      peers.current = {};
    };
  }, [localStream, addRemoteStream, removeRemoteStream]);
}
