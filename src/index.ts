import { SNSEvent } from 'aws-lambda'

export async function handler(event: SNSEvent) {
  // TODO: implement your function here
  console.log(JSON.stringify(event, null, 2))
  return 'something'
}
