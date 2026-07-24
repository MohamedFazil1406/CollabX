import { io, Socket } from "socket.io-client";
import { CodeServiceMsg, RoomServiceMsg, type EditOp } from "@collabx/types";

describe("Collaborative Code Service", () => {
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

  it("should setup room", (done) => {
    client1.emit(RoomServiceMsg.CREATE, "Fazil");

    client1.once(RoomServiceMsg.CREATE, (id: string) => {
      roomId = id;

      client2.emit(RoomServiceMsg.JOIN, roomId, "Ahmed");

      client2.once(RoomServiceMsg.JOIN, () => done());
    });
  });

  it("should broadcast code updates", (done) => {
    const operation: EditOp = ["console.log('Hello World');", 1, 1, 1, 1];

    client2.once(CodeServiceMsg.UPDATE_CODE, (received: EditOp) => {
      try {
        expect(received).toEqual(operation);
        done();
      } catch (err) {
        done(err);
      }
    });

    client1.emit(CodeServiceMsg.UPDATE_CODE, operation);
  });
});
