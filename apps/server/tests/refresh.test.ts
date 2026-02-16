import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";

const registerBody = {
  username: "evans",
  email: "evans@gmail.com",
  password: "Evans1234",
};

describe("REFRESH", () => {
  it("refresh rotates refresh token and prevents reuse of old token", async () => {
    const agent = request.agent(app);
    const loginRes = await agent
      .post("/api/auth/login")
      .send({ email: registerBody.email, password: registerBody.password });
    expect(loginRes.status).toBe(200);
    const raw = loginRes.headers["set-cookie"];
    const cookies1 = Array.isArray(raw) ? raw : [raw];
    const oldRefCooks = cookies1?.find((c) => c.startsWith("refreshToken="));
    const oldRefVal = oldRefCooks.split(";")[0];

    // first refresh to be 201;
    await new Promise((r) => setTimeout(r, 1100));
    const refresh1 = await agent.post("/api/auth/refresh-token").send({});
    expect(refresh1.status).toBe(200);

    //second refresh to fail;
    const replay = await request(app)
      .post("/api/auth/refresh-token")
      .set("Cookie", oldRefVal)
      .send({});
    expect(replay.status).toBe(401);
  });
});
