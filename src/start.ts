import { S3Client } from '@aws-sdk/client-s3'
import { fromIni } from '@aws-sdk/credential-provider-ini'
import { roleAssumer } from './role-assumer'
import { housekeeping } from './housekeeping'

const bucket = process.env['BUCKET'] || 'some-bucket'

const s3 = new S3Client({
  region: process.env['REGION'] || 'eu-central-1',
  credentials: fromIni({ profile: process.env['PROFILE'], roleAssumer }), // use profile from ~/.aws/config
})

housekeeping(s3, bucket).catch(console.error)
