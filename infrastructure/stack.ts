import { Stack } from '@atombrenner/cfn-stack'
import { readFileSync } from 'fs'

async function main() {
  const params = { SomeParameter: 'example parameter' }
  const template = readFileSync(new URL('./cloudformation.yaml', import.meta.url), {
    encoding: 'utf-8',
  })
  const stack = new Stack({
    name: `typescript-lambda`,
    region: 'eu-west-1',
    profile: 'atombrenner',
  })

  // create or update stack, print events and wait for completion
  await stack.createOrUpdate(template, params)

  // access stack outputs
  const outputs: Record<string, string> = await stack.getOutputs()
  console.log()
  console.log(`LambdaUrl: ${outputs.LambdaUrl}`)
}

main().catch((err) => {
  console.error(err.name ?? '', err.message)
  process.exit(1) // exit the process with an error code
})
