import { handler } from './index'

test('Processing a sample event should not fail ', async () => {
  const event = { Records: [] }

  const result = await handler(event)

  expect(result).toEqual('something')
})
