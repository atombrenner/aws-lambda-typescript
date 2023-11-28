# AWS Lambda Typescript Boilerplate Code

Fork this repository to quickstart lambda function development with Typescript. Perfect for microservices.

## Features

- build and deploy in seconds, thanks to esbuild and using the AWS Lambda API directly
- minified bundles (less space, faster startup, faster deployment)
- full source map support with readable stack traces
- infrastructure as code with Cloudformation
- Jest as a testing framework
- the whole tool chain is an npm package, no need to install additional tools like aws-cli or zip

## Prerequisites

- run `npm ci`

## Commands

- `npm test` execute tests with jest
- `npm run build` create ./dist/lambda.js bundle
- `npm run zip` create the ./dist/lambda.zip from ./dist/lambda.js and ./dist/lambda.js.map
- `npm run dist` run all of the above steps
- `npm run stack` create or update the CloudFormation stack
- `npm run deploy` used to deploy ./dist/lambda.zip to the created lambda function
- `npm start` will start the lambda function locally

Hint: Currently the region is hardcoded to eu-west-1. TODO: AWS environment parameter should work.
Example

```
AWS_REGION=eu-central-1 AWS_PROFILE=atombrenner npm run stack
```

## Tools

- [esbuild](https://esbuild.github.io/)
- [Jest](https://jestjs.io/) for testing
- [Babel](https://babeljs.io/) as a Jest transformer
- [Prettier](https://prettier.io/) for code formatting
- [Husky](https://github.com/typicode/husky) for managing git hooks, e.g. run tests before committing

### Deprecated Tools

- [Webpack](https://webpack.js.org/)
- [Parcel](https://github.com/parcel-bundler/parcel)
- [CDK](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-construct-library.html) for managing infrastructure with AWS CloudFormation

## Learnings

Dropped CDK because it was too heavy-weight for simple lambda microservices.
It was hard to maintain a second package.json and tsconfig.json just for CDK.
Having a single Cloudformation template and deploy it via API is much faster and easier to maintain.
The function can be updated (deployed) by a simple API call, decoupled from other infrastructure updates.
Deploying a new version or rolling back to an old one takes only a few seconds.,

Switched to use [esbuild](https://esbuild.github.io/) for transpiling and bundling lambda typescript source.
Compared to webpack, esbuild configuration is minimal and it is unbelievably fast.
The generated bundle is slightly larger than with webpack, but for AWS Lambdas a waste of a few kilobytes doesn't matter.
The important thing is, that all needed dependencies are bundled and all the noise from node_modules (tests, sources, readme, etc) is excluded.
As esbuild is only transpiling typescript, a separate call to `tsc` run is necessary for `npm run dist`.

- generate and use source maps to have readable stack traces in production
- `--sourcemap --sources-content=false` generates a small source-map without embedded sources
- `--keepnames` does not minifiy names which makes stack traces even more human-readable
- `NODE_OPTIONS=--enable-source-maps` enables experimental source-map support in AWS Lambda nodejs
