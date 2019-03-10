import { SharedIniFileCredentials, CloudFormation, AWSError } from 'aws-sdk'
import Config from './lambda.config'
import { readFileSync } from 'fs'
import { UpdateStackInput, StackEvent } from 'aws-sdk/clients/cloudformation'

process.env.AWS_SDK_LOAD_CONFIG = 'true' // This is necessary to load profiles from ~/.aws/config
const credentials = new SharedIniFileCredentials({ profile: Config.profile })
const cloudformation = new CloudFormation({ region: Config.region, credentials: credentials })

function loadTemplate(): string {
  return readFileSync('./cloudformation.yml').toString('UTF-8')
}

async function createOrUpdate() {
  const stack: UpdateStackInput = {
    StackName: Config.name,
    Capabilities: ['CAPABILITY_IAM', 'CAPABILITY_NAMED_IAM'],
    TemplateBody: loadTemplate(),
    Parameters: [
      // {
      //   ParameterKey: 'STRING_VALUE',
      //   ParameterValue: 'STRING_VALUE',
      //   ResolvedValue: 'STRING_VALUE',
      //   UsePreviousValue: true || false
      // },
      /* more items */
    ],
  }
  const start = new Date()
  await cloudformation
    .updateStack(stack)
    .promise()
    .catch(err => {
      if (stackDoesNotExist(err)) {
        return cloudformation.createStack({ OnFailure: 'DELETE', ...stack }).promise() as unknown
      } else {
        return Promise.reject(err)
      }
    })
  await logStackEvents(start)
}

async function logStackEvents(start: Date, expected = /(CREATE_COMPLETE|UPDATE_COMPLETE)$/) {
  const shown = new Set<string>()
  const finished = /(CREATE_COMPLETE|UPDATE_COMPLETE|DELETE_COMPLETE|ROLLBACK_COMPLETE|ROLLBACK_FAILED|CREATE_FAILED|DELETE_FAILED)$/
  let status = ''
  while (!status.match(finished)) {
    await delay(1000)
    const response = await cloudformation.describeStackEvents({ StackName: Config.name }).promise()
    const events = response.StackEvents || []
    events
      .filter(e => e.Timestamp > start && !shown.has(e.EventId))
      .reverse()
      .forEach(e => {
        logEvent(e)
        shown.add(e.EventId)
        if (e.ResourceType === 'AWS::CloudFormation::Stack') {
          status = e.ResourceStatus || ''
        }
      })
  }
  if (!status.match(expected)) throw `Unexpected Stack Status ${status}`
}

function logEvent(e: StackEvent): void {
  const props = [
    e.Timestamp.toISOString(),
    e.LogicalResourceId,
    e.ResourceStatus,
    e.ResourceType,
    e.ResourceStatusReason,
  ]
  const line = props.map(s => s || '').join('  ')
  console.log(line)
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function stackDoesNotExist(err: AWSError): boolean {
  return err.code === 'ValidationError' && err.message.includes('does not exist')
}

function stackIsUpToDate(err: AWSError): boolean {
  return err.code === 'ValidationError' && err.message.includes('No updates are to be performed')
}

createOrUpdate().catch(err => {
  if (stackIsUpToDate(err)) {
    console.log(err.message)
  } else {
    console.error(err)
    process.exit(1)
  }
})
