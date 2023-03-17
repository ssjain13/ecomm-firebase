const request = require("supertest");
const app = require("../index");

describe("GET /", () => {
  it("should respond with 200 status code and welcome message", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("<h1>Welcome to Fashionesta-API</h1>");
    expect(response.headers["content-type"]).toBe("text/html");
  });
});
