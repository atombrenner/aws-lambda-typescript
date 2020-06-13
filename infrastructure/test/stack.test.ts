import { SynthUtils } from '@aws-cdk/assert'
import { App } from '@aws-cdk/core'
import { LambdaStack } from '../lib/lambda-stack'

test('Snapshot', () => {
  const app = new App()
  // WHEN
  const stack = new LambdaStack(app, 'MyTestStack')
  // THEN
  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot()
})
