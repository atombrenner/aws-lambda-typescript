import { LambdaClient, UpdateFunctionCodeCommand } from '@aws-sdk/client-lambda'
import { readFileSync } from 'fs'

async function main() {
  const lambda = new LambdaClient({ region: 'eu-west-1' })

  const buffer = readFileSync('./dist/lambda.zip')

  const result = await lambda.send(
    new UpdateFunctionCodeCommand({ FunctionName: 'typescript-lambda', ZipFile: buffer })
  )

  console.dir(result)
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1) // exit the process with an error code
})
