import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("REFRESH", () => {
	it("refresh rotates refresh token and prevents reuse of old token", async () => {
		const registerBody = {
			username: "lilian",
			email: `lilian+${Date.now()}@gmail.com`,
			password: "Lilian1234",
		};

		const agent = request.agent(app);
		const registerRes = await agent
			.post("/api/auth/register")
			.send(registerBody);
		expect(registerRes.status).toBe(201);

		const loginRes = await agent
			.post("/api/auth/login")
			.send({ email: registerBody.email, password: registerBody.password });
		expect(loginRes.status).toBe(200);

		const loginCookieHeader = loginRes.headers["set-cookie"];
		if (!loginCookieHeader) throw new Error("No cookies set on login response");
		const loginCookies =
			Array.isArray(loginCookieHeader) ? loginCookieHeader : (
				[loginCookieHeader]
			);
		const oldRefreshCookie = loginCookies.find((c) =>
			c.startsWith("refreshToken="),
		);
		if (!oldRefreshCookie)
			throw new Error("refreshToken cookie missing after login");
		const oldRefreshValue = oldRefreshCookie.split(";")[0];

		const refreshRes = await agent.post("/api/auth/refresh-token").send({});
		expect(refreshRes.status).toBe(200);

		const refreshCookieHeader = refreshRes.headers["set-cookie"];
		if (!refreshCookieHeader)
			throw new Error("No cookies set on refresh response");
		const refreshCookies =
			Array.isArray(refreshCookieHeader) ? refreshCookieHeader : (
				[refreshCookieHeader]
			);
		const newRefreshCookie = refreshCookies.find((c) =>
			c.startsWith("refreshToken="),
		);
		if (!newRefreshCookie)
			throw new Error("refreshToken cookie missing after token rotation");
		const newRefreshValue = newRefreshCookie.split(";")[0];
		expect(newRefreshValue).not.toBe(oldRefreshValue);

		//second refresh to fail;
		const replay = await request(app)
			.post("/api/auth/refresh-token")
			.set("Cookie", oldRefreshValue)
			.send({});
		expect(replay.status).toBe(401);
	})
});
