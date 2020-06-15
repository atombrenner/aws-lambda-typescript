# AWS Lambda Typescript Boilerplate Code

Fork this repository to quickstart lambda development with Typescript and CDK.

## Prerequisites

- setup [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
- run `npm ci && cd infrastructure && npm ci`

## Commands

- `npm t` executes test with jest
- `npm run build` creates the transpiled lambda bundle with webpack and babel
- `npm run zip` creates the lambda.zip from dist folder
- `npm run dist` runs all of the above steps
- `npm run stack` uses CDK to create update CloudFormation infrastructure see [CDK readme](./infrastructure/README.md)
   add profile if necessary, e.g. `-- --profile atombrenner`
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

It was necessary to run `npm dedupe` before webpack to get the bundle size down. Maybe it has somehting to do with the gamma versioning, which is not semver.
