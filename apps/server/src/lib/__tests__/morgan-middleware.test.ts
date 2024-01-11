// FILEPATH: /c:/Users/ASUS/Development/pragma-poker/apps/server/src/lib/__tests__/morgan-middleware.test.ts
import { expect, test } from 'vitest'
import morganMiddleware from '../morganMiddleware'

test('morganMiddleware is defined', () => {
  expect(morganMiddleware).toBeDefined()
})