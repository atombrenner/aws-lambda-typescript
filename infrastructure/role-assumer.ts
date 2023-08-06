import { STS, AssumeRoleRequest } from '@aws-sdk/client-sts'
import { AwsCredentialIdentity } from '@aws-sdk/types'

// TODO: why the heck is this glue code not part of the aws sdk?
export const roleAssumer = async (
  sourceCreds: AwsCredentialIdentity,
  assumeRoleRequest: AssumeRoleRequest
) => {
  const sts = new STS({ region: 'eu-west-1', credentials: sourceCreds })
  const { Credentials } = await sts.assumeRole(assumeRoleRequest)
  if (!Credentials) throw Error('Could not assume role')
  return {
    accessKeyId: Credentials.AccessKeyId!,
    secretAccessKey: Credentials.SecretAccessKey!,
    sessionToken: Credentials.SessionToken!,
    expiration: Credentials.Expiration!,
  }
}
