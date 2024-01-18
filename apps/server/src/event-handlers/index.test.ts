import { describe, expect, it } from "vitest";
import * as index from "./index"

describe("Event-handlers index barrel file", () => {
  it("createMatch is defined", () => {
    expect(index.createMatch).toBeDefined()
  })

  it('joinMatch is defined', () => {
    expect(index.joinMatch).toBeDefined()
  })

  it('onDoesMatchExist is defined', () => {
    expect(index.onDoesMatchExist).toBeDefined()
  })

  it('onChooseCard is defined', () => {
    expect(index.onChooseCard).toBeDefined()
  })

  it('onRevealCards is defined', () => {
    expect(index.onRevealCards).toBeDefined()
  })

  it('onResetGame is defined', () => {
    expect(index.onResetGame).toBeDefined()
  })

  it('onAssignAdmin is defined', () => {
    expect(index.onAssignAdmin).toBeDefined()
  })
})