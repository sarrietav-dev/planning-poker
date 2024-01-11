import { expect, test } from "vitest";
import { io, server } from "./index";

test("Express server is defined", () => {
  expect(server).toBeDefined()
})

test("Socket.io server is defined", () => {
  expect(io).toBeDefined()
})