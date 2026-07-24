import { io, Socket } from "socket.io-client";
import { RoomServiceMsg, StreamServiceMsg } from "@collabx/types";

describe("Collaborative Stream Service", () => {
  let client1: Socket;
  let client2: Socket;

  let roomId = "";
  let client2CustomId = "";

  beforeAll(async () => {
    client1 = io("http://localhost:3000", {
      transports: ["websocket"],
    });

    client2 = io("http://localhost:3000", {
      transports: ["websocket"],
    });

    await Promise.all([
      new Promise<void>((resolve) => client1.on("connect", () => resolve())),
      new Promise<void>((resolve) => client2.on("connect", () => resolve())),
    ]);
  });

  afterAll(() => {
    client1.disconnect();
    client2.disconnect();
  });

  it("should create and join room", (done) => {
    client1.emit(RoomServiceMsg.CREATE, "Fazil");

    client1.once(RoomServiceMsg.CREATE, (id: string) => {
      roomId = id;

      client2.emit(RoomServiceMsg.JOIN, roomId, "Ahmed");

      client2.once(RoomServiceMsg.JOIN, (customId: string) => {
        client2CustomId = customId;
        done();
      });
    });
  });

  it("should forward signal to target user", (done) => {
    const signal = {
      type: "offer",
      sdp: "dummy-sdp",
    };

    client2.once(
      StreamServiceMsg.SIGNAL,
      (payload: { userID: string; signal: unknown }) => {
        try {
          expect(payload.userID).toBeDefined();
          expect(payload.signal).toEqual(signal);
          done();
        } catch (err) {
          done(err);
        }
      },
    );

    client1.emit(StreamServiceMsg.SIGNAL, {
      targetUserID: client2CustomId,
      signal,
    });
  });

  it("should notify when camera is turned off", (done) => {
    client2.once(StreamServiceMsg.CAMERA_OFF, (userId: string) => {
      try {
        expect(userId).toBeDefined();
        done();
      } catch (err) {
        done(err);
      }
    });

    client1.emit(StreamServiceMsg.CAMERA_OFF);
  });

  it("should broadcast microphone state", (done) => {
    client2.once(
      StreamServiceMsg.MIC_STATE,
      (payload: { userID: string; micOn: boolean }) => {
        try {
          expect(payload.userID).toBeDefined();
          expect(payload.micOn).toBe(true);
          done();
        } catch (err) {
          done(err);
        }
      },
    );

    client1.emit(StreamServiceMsg.MIC_STATE, true);
  });

  it("should broadcast speaker state", (done) => {
    client2.once(
      StreamServiceMsg.SPEAKER_STATE,
      (payload: { userID: string; speakersOn: boolean }) => {
        try {
          expect(payload.userID).toBeDefined();
          expect(payload.speakersOn).toBe(false);
          done();
        } catch (err) {
          done(err);
        }
      },
    );

    client1.emit(StreamServiceMsg.SPEAKER_STATE, false);
  });
});
