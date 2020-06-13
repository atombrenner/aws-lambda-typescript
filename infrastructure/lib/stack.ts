import * as cdk from '@aws-cdk/core'
import { Duration } from '@aws-cdk/core'
import { Function, Runtime, Code } from '@aws-cdk/aws-lambda'
import { RetentionDays } from '@aws-cdk/aws-logs'
import { Rule, Schedule } from '@aws-cdk/aws-events'
import { LambdaFunction } from '@aws-cdk/aws-events-targets'

export class Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const fn = new Function(this, 'MyLambdaFunction', {
      functionName: 'MyLambdaFunction',
      runtime: Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: Code.fromAsset('../dist/lambda.zip'),
      memorySize: 256,
      timeout: Duration.minutes(5),
      logRetention: RetentionDays.ONE_WEEK,
    })

    new Rule(this, 'DailyId', {
      schedule: Schedule.rate(Duration.days(1)),
      targets: [new LambdaFunction(fn)],
    })
  }
}
