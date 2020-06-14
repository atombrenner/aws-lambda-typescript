import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'

export type Artifact = {
  key: string
  lastModified: number
  size: number
}

export const housekeeping = async (s3: S3Client, bucket: string) => {
  const folders = await listTopLevelFolders(s3, bucket)
  await Promise.all(
    folders.map(async (folder) => {
      const artifacts = await listArtifacts(s3, bucket, folder)
      const artifactsToDelete = getArtifactsToDelete(artifacts)
      await deleteArtifacts(s3, bucket, artifactsToDelete)
    })
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
      if (o.Key && o.LastModified && typeof o.Size !== 'undefined') {
        // ignore incomplete metadata just because the s3 typescript suggests that values might be undefined
        artifacts.push({ key: o.Key, lastModified: +o.LastModified, size: o.Size })
      }
    })
  } while (ContinuationToken)
  return artifacts
}

// Keep at least the newest `keepCount` artifacts
export function getArtifactsToDelete(artifacts: readonly Artifact[], keepCount = 30): Artifact[] {
  return [...artifacts] // make a copy because .sort() will modify existing array
    .sort((a, b) => a.lastModified - b.lastModified) // sort to oldest first
    .slice(0, Math.max(0, artifacts.length - keepCount))
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
