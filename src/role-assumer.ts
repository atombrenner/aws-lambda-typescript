import { STS } from '@aws-sdk/client-sts';
import { AssumeRoleParams } from '@aws-sdk/credential-provider-ini';
import { Credentials } from '@aws-sdk/types';


// TODO: why the heck is this glue code not part of the aws sdk?
export const roleAssumer = async (sourceCreds: Credentials, assumeRoleParams: AssumeRoleParams) => {
  const sts = new STS({ region: 'eu-west-1', credentials: sourceCreds });
  const { Credentials } = await sts.assumeRole({ ...assumeRoleParams });
  if (!Credentials)
    throw Error('Could not assume role');
  return {
    accessKeyId: Credentials.AccessKeyId!,
    secretAccessKey: Credentials.SecretAccessKey!,
    sessionToken: Credentials.SessionToken!,
    expiration: Credentials.Expiration!,
  };
};
