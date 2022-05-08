import { Stack } from '@atombrenner/cfn-stack'
import * as fs from 'fs'

async function main() {
  const params = { SomeParameter: 'example parameter' }
  const template = fs.readFileSync(`${__dirname}/cloudformation.yaml`, { encoding: 'utf-8' })
  const stack = new Stack({ name: `typescript-lambda`, region: 'eu-west-1' })

  // create or update stack, print events and wait for completion
  await stack.createOrUpdate(template, params)

  // access stack outputs
  const outputs: Record<string, string> = await stack.getOutputs()
  console.log()
  console.log(`LambdaUrl: ${outputs.LambdaUrl}`)
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1) // exit the process with an error code
})
