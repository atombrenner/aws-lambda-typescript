import { ScheduledEvent } from 'aws-lambda'
import { S3Client } from '@aws-sdk/client-s3'
import { housekeeping } from './housekeeping'

const bucket = process.env['BUCKET'] || 'please-name-your-bucket'

const s3 = new S3Client({
  region: process.env['REGION'] || 'eu-central-1',
})

export async function handler(event: ScheduledEvent) {
  console.log(JSON.stringify(event, null, 2))
  console.log('Housekeeping started for Bucket ' + bucket)
  await housekeeping(s3, bucket)
  console.log('Housekeeping finished')
}
