import { handler } from './lambda'
import { ScheduledEvent } from 'aws-lambda'
import { housekeeping } from './housekeeping'
import '@aws-sdk/client-s3'

jest.mock('@aws-sdk/client-s3') // because it implicitly starts promise that will fail because we are not running on AWS
jest.mock('./housekeeping')
jest.spyOn(console, 'log').mockImplementation(() => {})

test('Processing any event should call housekeeping', async () => {
  const event = { id: 'someId' } as ScheduledEvent

  await handler(event)

  expect(console.log).toHaveBeenNthCalledWith(1, JSON.stringify(event, null, 2))
  expect(console.log).toHaveBeenNthCalledWith(2, expect.stringMatching(/^Housekeeping started/))
  expect(housekeeping).toHaveBeenCalled()
  expect(console.log).toHaveBeenLastCalledWith('Housekeeping finished')
})
