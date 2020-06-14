import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'

type Artifact = {
  key: string
  lastModified: Date
  size: number
}

export const housekeeping = async (s3: S3Client, bucket: string) => {
  const folders = await listTopLevelFolders(s3, bucket)
  await Promise.all(
    folders.map((folder) =>
      listArtifacts(s3, bucket, folder).then((artifacts) =>
        deleteArtifacts(s3, bucket, getArtifactsToDelete(artifacts))
      )
    )
  )
}

async function listTopLevelFolders(s3: S3Client, Bucket: string) {
  const folders: string[] = []
  let ContinuationToken: string | undefined
  do {
    const command = new ListObjectsV2Command({
      Bucket,
      ContinuationToken,
      Delimiter: '/',
    })
    const output = await s3.send(command)
    ContinuationToken = output.NextContinuationToken
    output.CommonPrefixes?.forEach((a) => a.Prefix && folders.push(a.Prefix))
  } while (ContinuationToken)
  return folders
}

async function listArtifacts(s3: S3Client, Bucket: string, folder: string) {
  const artifacts: Artifact[] = []
  let ContinuationToken: string | undefined
  do {
    const command = new ListObjectsV2Command({
      Bucket,
      ContinuationToken,
      Prefix: folder,
    })
    const output = await s3.send(command)
    ContinuationToken = output.NextContinuationToken
    output.Contents?.forEach((o) => {
      if (!(o.Key && o.LastModified && typeof o.Size !== 'undefined')) {
        throw Error(`unexpected s3 object metadata: ${JSON.stringify(o, null, 2)}`)
      }
      artifacts.push({ key: o.Key, lastModified: o.LastModified, size: o.Size })
    })
  } while (ContinuationToken)
  return artifacts
}

function getArtifactsToDelete(artifacts: Artifact[]): Artifact[] {
  return artifacts
}

async function deleteArtifacts(s3: S3Client, Bucket: string, artifacts: Artifact[]) {
  console.log(artifacts.map((a) => a.key).join('\n'))
}

// async function deleteObjects(Objects: ObjectIdentifier[]) {
//   const response = await s3.deleteObjects({
//     Bucket,
//     Delete: { Objects },
//   })
//   if (response.Errors) errorCount += response.Errors.length
//   if (response.Deleted) deleteCount += response.Deleted.length

//   const fmtNumber = (n: number) => n.toString().padStart(10)
//   console.log(`Deleted: ${fmtNumber(deleteCount)} Errors: ${fmtNumber(errorCount)}`)
// }
