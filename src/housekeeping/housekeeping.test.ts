import { getArtifactsToDelete, Artifact } from './housekeeping'

const MiliSecondsPerDay = 24 * 60 * 60 * 1000
const Now = Date.now()

const toArtifact = (ageInDays: number): Artifact => ({
  key: `folder/artifact-${ageInDays}.zip`,
  lastModified: Now - (ageInDays * MiliSecondsPerDay + MiliSecondsPerDay / 2),
  size: 1,
})

describe('getArtifactsToDelete', () => {
  const keepNewestFive = 5

  it('should keep all artifacts if there a less than keepCount artifacts', () => {
    const artifacts = [1, 2, 3].map(toArtifact)

    const toDelete = getArtifactsToDelete(artifacts, keepNewestFive)

    expect(toDelete).toHaveLength(0)
  })

  it('should keep the newest keepCount artifacts', () => {
    const artifacts = [1, 2, 3, 4, 5, 6, 7].map(toArtifact)

    const toDelete = getArtifactsToDelete(artifacts, keepNewestFive)

    expect(toDelete).toStrictEqual([7, 6].map(toArtifact))
  })

  it('should keep the newest keepCount artifacts given unsorted artifacts', () => {
    const artifacts = [1, 2, 7, 3, 4, 6, 5].map(toArtifact)

    const toDelete = getArtifactsToDelete(artifacts, keepNewestFive)

    expect(toDelete).toStrictEqual([7, 6].map(toArtifact))
  })
})
