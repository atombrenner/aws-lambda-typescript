import { LambdaClient, UpdateFunctionCodeCommand } from '@aws-sdk/client-lambda'
import { readFileSync } from 'fs'

async function main() {
  const lambda = new LambdaClient({ region: 'us-east-1' })

  const buffer = readFileSync('./dist/lambda.zip')

  const result = await lambda.send(
    new UpdateFunctionCodeCommand({ FunctionName: 'plin-clientes-monday-CRM-geral', ZipFile: buffer })
  )

  console.dir(result)
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1) // exit the process with an error code
})
