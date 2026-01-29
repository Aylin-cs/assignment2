import request from "supertest";
import { createApp } from "../src/app";

const app = createApp();

describe("API flow", () => {
  it("register -> login -> create post -> add comment", async () => {
    const email = "t1@example.com";
    const username = "tester1";
    const password = "123456";

    await request(app)
      .post("/auth/register")
      .send({ email, username, password })
      .expect(201);

    const loginRes = await request(app)
      .post("/auth/login")
      .send({ email, password })
      .expect(200);

    const accessToken = loginRes.body?.accessToken;
    expect(accessToken).toBeTruthy();

    const postRes = await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ content: "hello" })
      .expect(201);

    const postId = postRes.body?._id;
    expect(postId).toBeTruthy();

    const commentRes = await request(app)
      .post(`/posts/${postId}/comments`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ content: "Nice post!" })
      .expect(201);

    expect(commentRes.body?._id).toBeTruthy();
  });

  it("blocks creating a post without token", async () => {
    await request(app).post("/posts").send({ content: "no token" }).expect(401);
  });
});
