import { SNSEvent } from 'aws-lambda'
import { readFileSync } from 'fs'

export async function handler(event: SNSEvent) {
  // TODO: implement your function here
  const a = [1, 2, 3]
  a?.flatMap((b) => b)

  console.log(JSON.stringify(event, null, 2))
  return 'something'
}
