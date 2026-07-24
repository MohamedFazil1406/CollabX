import { io, Socket } from "socket.io-client";
import { ScrollServiceMsg, RoomServiceMsg, type Scroll } from "@collabx/types";

describe("Collaborative Scroll Service", () => {
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

  it("should create and join room", (done) => {
    client1.emit(RoomServiceMsg.CREATE, "Fazil");

    client1.once(RoomServiceMsg.CREATE, (id: string) => {
      roomId = id;

      client2.emit(RoomServiceMsg.JOIN, roomId, "Ahmed");

      client2.once(RoomServiceMsg.JOIN, () => done());
    });
  });

  it("should broadcast scroll updates", (done) => {
    const scroll: Scroll = [400, 80];

    client2.once(
      ScrollServiceMsg.UPDATE_SCROLL,
      (customId: string, received: Scroll) => {
        try {
          expect(customId).toBeDefined();
          expect(received).toEqual(scroll);
          done();
        } catch (err) {
          done(err);
        }
      },
    );

    client1.emit(ScrollServiceMsg.UPDATE_SCROLL, scroll);
  });
});
