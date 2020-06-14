# AWS Lambda Typescript Boilerplate Code

Fork this repository to quickstart lambda development with Typescript and CDK.

## Prerequisites

- setup [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
- run `npm ci && cd infrastructure && npm ci`

## Commands

- `npm run build` transpile typescript using parcel
- `npm run zip` creates the lambda.zip from dist folder
- `npm run stack` uses CDK to create update CloudFormation infrastructure see [CDK readme](./infrastructure/README.md)
   add profile if necessary, e.g. `-- --profile atombrenner`
- `npm start` will run the lambda function locally

## Tools

- [CDK](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-construct-library.html) for managing infrastructure with AWS CloudFormation
- [Parcel](https://github.com/parcel-bundler/parcel) for transpiling, bundling and tree shaking
- [Jest](https://jestjs.io/) for testing
- [Prettier](https://prettier.io/) for code formatting
- [Husky](https://github.com/typicode/husky) for managing git hooks, e.g. run tests before committing

