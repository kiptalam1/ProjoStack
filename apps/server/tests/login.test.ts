import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";

const registerBody = {
  email: "adams@gmail.com",
  password: "Adams1234",
  username: "adams",
};

describe("LOGIN", () => {
  it("login user and set cookies", async () => {
    const res = await request.agent(app).post("/api/auth/login").send({
      email: registerBody.email,
      password: registerBody.password,
    });
    expect(res.status).toBe(200);
    expect(res.headers["set-cookie"]).toBeDefined();
  });
  it("has access and refresh tokens after login and hash stored", async () => {
    const res = await request.agent(app).post("/api/auth/login").send({
      email: registerBody.email,
      password: registerBody.password,
    });
    const raw = res.headers["set-cookie"];
    if (!raw) throw new Error("no cookies set");
    const cookies = Array.isArray(raw) ? raw : [raw];
    const hasAccess = cookies.some((c) => c.startsWith("accessToken="));
    const hasRefresh = cookies.some((c) => c.startsWith("refreshToken="));
    expect(hasAccess).toBe(true);
    expect(hasRefresh).toBe(true);

    const user = await prisma.user.findUnique({
      where: { email: registerBody.email },
    });
    expect(user?.refreshToken).toBeTruthy();
  });
});
