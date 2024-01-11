import { describe } from "node:test"
import { beforeEach, expect, it, vi } from "vitest"
import { AppSocket } from "../types"
import socketMiddleware from "./index"
import { getSession } from "../db/repository"
import { nanoid } from "nanoid"

vi.mock('../db/repository')
const repoMock = vi.mocked(getSession)

vi.mock('nanoid')
const nanoidMock = vi.mocked(nanoid)

describe('socketMiddleware', () => {
  let socket: AppSocket;

  beforeEach(() => {
    socket = {
      handshake: {
        auth: {}
      },
      data: {}
    } as unknown as AppSocket

    vi.clearAllMocks()
  })

  it('should set sessionId and userId if sessionId is provided', async () => {
    const next = vi.fn()
    socket.handshake.auth.sessionId = 'sessionId'
    repoMock.mockResolvedValue({ sessionId: 'sessionId', userId: 'userId' })

    await socketMiddleware(socket, next);

    expect(socket.data.sessionId).toBe('sessionId')
    expect(socket.data.userId).toBe('userId')
  })

  it('should generate sessionId and userId if sessionId is not provided', async () => {
    const next = vi.fn()
    repoMock.mockResolvedValue({ sessionId: 'sessionId', userId: 'userId' })
    nanoidMock.mockReturnValue('nanoid')

    await socketMiddleware(socket, next);

    expect(nanoidMock).toHaveBeenCalledTimes(2);
    console.log(socket)
    expect(socket.data.sessionId).toStrictEqual(expect.any(String))
    expect(socket.data.userId).toStrictEqual(expect.any(String))
  })

  it('should generate sessionId and userId if the session was not stored', async () => {
    const next = vi.fn()
    repoMock.mockResolvedValue({})
    nanoidMock.mockReturnValue('nanoid')

    await socketMiddleware(socket, next);

    expect(nanoidMock).toHaveBeenCalledTimes(2);
    expect(socket.data.sessionId).toStrictEqual(expect.any(String))
    expect(socket.data.userId).toStrictEqual(expect.any(String))

  })

  it('should call next', async () => {
    const next = vi.fn()
    repoMock.mockResolvedValue({ sessionId: 'sessionId', userId: 'userId' })

    await socketMiddleware(socket, next);

    expect(next).toHaveBeenCalledTimes(1);
  })
})