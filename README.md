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
- [Webpack](https://webpack.js.org/)
- [Parcel](https://github.com/parcel-bundler/parcel)
- [Jest](https://jestjs.io/) for testing
- [Prettier](https://prettier.io/) for code formatting
- [Husky](https://github.com/typicode/husky) for managing git hooks, e.g. run tests before committing

## Gotchas

The generated artifact (bundle) got very big. It was necessary to
- use webpack. Parcel and rollup bundles did not bundle the AWS SDK at all.
- run `npm dedupe`, else webpack includes the same version of the tslib helper library multiple times in the same bundle
- could not use ts-loader, as it breaks tree shaking. In theory, if tsc emits es2015 modules, it should work.
  But setting tsconfig.json module to "es2015" breaks importing modules from node_modules
- run `npx tsc` as a separate step before running because babel-loader only transpiles but does not type check

## TODO
Figure out how to use ts-loader, as this is using tsc which is much safer as the babel transpilation which has a long
list of [caveeats](https://babeljs.io/docs/en/babel-plugin-transform-typescript#caveats) on its own
