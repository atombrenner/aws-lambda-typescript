import { Stack, StackProps, Construct, Duration } from '@aws-cdk/core'
import { Function, Runtime, Code } from '@aws-cdk/aws-lambda'
import { Bucket } from '@aws-cdk/aws-s3'
import { RetentionDays } from '@aws-cdk/aws-logs'
import { Rule, Schedule } from '@aws-cdk/aws-events'
import { LambdaFunction } from '@aws-cdk/aws-events-targets'

export class LambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const isTest = process.env.NODE_ENV === 'test'

    const myLambda = new Function(this, 'MyLambdaFunctionId', {
      functionName: 'MyLambdaFunction',
      description: 'Some description of my lambda function',
      runtime: Runtime.NODEJS_12_X,
      handler: 'lambda.handler',
      code: isTest ? Code.fromInline('test') : Code.fromAsset('../dist/lambda.zip'),
      memorySize: 256,
      timeout: Duration.minutes(5),
      logRetention: RetentionDays.ONE_WEEK, // this will trigger the creation of a custom lambda used by CDK which looks strange too me
      environment: {
        NODE_OPTIONS: '--enable-source-maps',
      },
    })

    const myBucket = new Bucket(this, 'MyBucketId', {
      bucketName: 'some-artifact-bucket',
    })
    myBucket.grantRead(myLambda)
    myBucket.grantDelete(myLambda)

    new Rule(this, 'MyScheduleId', {
      description: 'Triggers my lambda function on some schedule',
      schedule: Schedule.rate(Duration.days(1)),
      targets: [new LambdaFunction(myLambda)],
    })
  }
}
