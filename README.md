# AWS Lambda Typescript Boilerplate Code

Fork this repository to quickstart lambda development with Typescript and CDK and the [AWS SDK JS V3](https://github.com/aws/aws-sdk-js-v3)

## Prerequisites

- setup [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
- run `npm ci && cd infrastructure && npm ci && npm dedupe`

## Commands

- `npm t` executes test with jest
- `npm run build` creates ./dist/lambda.js bundle
- `npm run zip` creates the ./dist/lambda.zip from ./dist/lambda.js r
- `npm run dist` runs all of the above steps
- `npm run stack` uses CDK to create or update CloudFormation infrastructure, see [CDK readme](./infrastructure/README.md).
  Add profile if necessary, e.g. `-- --profile atombrenner`. Will deploy lambda.zip if changed.
- `npm run deploy` uses AWS CLI to just deploy the lambda.zip package code to the existing lambda function
- `npm start` will run the lambda function locally

## Tools

- [CDK](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-construct-library.html) for managing infrastructure with AWS CloudFormation
- [Babel](https://babeljs.io/)
- [esbuild](https://esbuild.github.io/)
- [Jest](https://jestjs.io/) for testing
- [Prettier](https://prettier.io/) for code formatting
- [Husky](https://github.com/typicode/husky) for managing git hooks, e.g. run tests before committing

### Deprecated Tools

- [Webpack](https://webpack.js.org/)
- [Parcel](https://github.com/parcel-bundler/parcel)

## Learnings

Switched to use [esbuild](https://esbuild.github.io/) for transpiling and bundling lambda typescript source.
Compared to webpack, esbuild configuration is minimal and it is unbelievable fast.
The generated bundle is slightly larger than with webpack, but for AWS Lambdas a waste of a few kilobytes doesn't matter.
The important thing is, that all needed dependencies are bundled and all the noise from node_modules (tests, sources, readme, etc) is excluded.
As esbuild is only transpiling typescript, a separate call to `tsc` run is necessary in `npm run dist`.

- generate and use source-maps to have readable stack traces in production
- `--sourcemap --sources-content=false` generates a small source-map without embedded sources
- `--keepnames` does not minifiy names which makes stack traces even more human readable
- `NODE_OPTIONS=--enable-source-maps` enables experimental source-map support in AWS Lambda nodejs
