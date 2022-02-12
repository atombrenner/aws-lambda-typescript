import { SynthUtils } from '@aws-cdk/assert'
import { App } from '@aws-cdk/core'
import { LambdaStack } from '../lib/lambda-stack'
import { writeFileSync } from 'fs'
import { join } from 'path'

test('Snapshot', () => {
  // ensure that we have some '../dist/lambda.zip' file
  writeFileSync(join('..', 'dist', 'lambda.zip'), 'dummy content')

  const app = new App()
  // WHEN
  const stack = new LambdaStack(app, 'MyTestStack')
  // THEN
  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot()
})
