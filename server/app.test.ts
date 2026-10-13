import request from "supertest"
import { describe, expect, it } from "vitest"
import { app } from "./app.js"

describe("API", () => {
  it("informa su estado", async () => {
    const response = await request(app).get("/api/health")
    expect(response.status).toBe(200)
    expect(response.body).toEqual({ status: "ok" })
  })

  it("protege recursos privados", async () => {
    const response = await request(app).get("/api/products")
    expect(response.status).toBe(401)
  })
})
