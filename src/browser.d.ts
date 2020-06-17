// This project targets lambda functions running on node
// I prefer to not have the DOM library typings, so I set
// `"lib":["ES2019"]` in tsconfig.json.
// Unfortunately the AWS SDK also uses two types from
// modern browsers, `ReadableStream` and `Blob`
// This file defines all referenced Browser Types to be never.

type ReadableStream = never
type Blob = never
