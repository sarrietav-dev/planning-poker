import { test, expect, vi } from 'vitest'
import client, { connectClient } from '../redis'

vi.mock('../../lib/logger')

test('connectClient should be a function', () => {
  expect(typeof connectClient).toBe('function')
})

test('connectClient should not throw an error', async () => {
  expect(() => connectClient()).not.toThrow()
})

test('client should be defined', () => {
  expect(client).toBeDefined()
})

test('client should have connect method', () => {
  expect(typeof client.connect).toBe('function')
})