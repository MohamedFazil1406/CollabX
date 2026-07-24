import { io, Socket } from "socket.io-client";
import { RoomServiceMsg } from "@collabx/types";

describe("Collaborative Room Service", () => {
  let client1: Socket;
  let client2: Socket;

  let roomId = "";

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

  it("should create a room", (done) => {
    client1.emit(RoomServiceMsg.CREATE, "Fazil");

    client1.once(
      RoomServiceMsg.CREATE,
      (createdRoomId: string, customId: string) => {
        try {
          roomId = createdRoomId;

          expect(roomId).toBeDefined();
          expect(roomId.length).toBeGreaterThan(0);

          expect(customId).toBeDefined();
          expect(typeof customId).toBe("string");

          done();
        } catch (err) {
          done(err);
        }
      },
    );
  });

  it("should allow another user to join the room and synchronize users", (done) => {
    client1.once(RoomServiceMsg.SYNC_USERS, (users: Record<string, string>) => {
      try {
        expect(users).toBeDefined();
        expect(Object.keys(users)).toHaveLength(2);

        expect(Object.values(users)).toContain("Fazil");
        expect(Object.values(users)).toContain("Ahmed");

        done();
      } catch (err) {
        done(err);
      }
    });

    client2.once(RoomServiceMsg.JOIN, (customId: string) => {
      expect(customId).toBeDefined();
      expect(typeof customId).toBe("string");
    });

    client2.emit(RoomServiceMsg.JOIN, roomId, "Ahmed");
  });

  it("should notify users when someone leaves", (done) => {
    client1.once(RoomServiceMsg.LEAVE, (socketId: string) => {
      try {
        expect(socketId).toBeDefined();
        expect(typeof socketId).toBe("string");

        done();
      } catch (err) {
        done(err);
      }
    });

    client2.emit(RoomServiceMsg.LEAVE);
  });
});
