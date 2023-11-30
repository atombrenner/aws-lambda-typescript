import { ScheduledEvent } from 'aws-lambda'
import { handler } from './handler'

handler({} as ScheduledEvent).catch(console.error)
