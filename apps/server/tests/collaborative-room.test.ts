import { io, Socket } from "socket.io-client";
import { RoomServiceMsg } from "@collabx/types";

describe("Collaborative Room", () => {
  let client: Socket;

  beforeAll((done) => {
    client = io("http://localhost:3000", {
      transports: ["websocket"],
    });

    client.on("connect", () => done());
    client.on("connect_error", done);
  });

  afterAll(() => {
    client.disconnect();
  });

  it("should create a room", (done) => {
    client.emit(RoomServiceMsg.CREATE, "Fazil");

    client.once(RoomServiceMsg.CREATE, (roomId: string, customId: string) => {
      try {
        expect(roomId).toBeDefined();
        expect(typeof roomId).toBe("string");
        expect(roomId.length).toBeGreaterThan(0);

        expect(customId).toBeDefined();
        expect(typeof customId).toBe("string");
        expect(customId.length).toBeGreaterThan(0);

        done();
      } catch (error) {
        done(error);
      }
    });
  });
});
