import { SharedIniFileCredentials, CloudFormation, AWSError, config } from 'aws-sdk'
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

  const shown = new Set<string>()
  for (let status = ''; !status.match(finished); ) {
    await delay(1000)
    const response = await cloudformation.describeStackEvents({ StackName: Config.name }).promise()
    const events = response.StackEvents || []
    events
      .filter(e => e.Timestamp > start && !shown.has(e.EventId))
      .reverse()
      .forEach(e => {
        logEvent(e)
        shown.add(e.EventId)
        status = e.ResourceStatus || ''
      })
  }
}

const finished = /(CREATE_COMPLETE|UPDATE_COMPLETE|DELETE_COMPLETE|ROLLBACK_COMPLETE|ROLLBACK_FAILED|CREATE_FAILED|DELETE_FAILED)$/

function logEvent(e: StackEvent): void {
  console.log(
    e.Timestamp,
    e.LogicalResourceId,
    e.ResourceStatus,
    e.ResourceType,
    e.ResourceStatusReason
  )
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
