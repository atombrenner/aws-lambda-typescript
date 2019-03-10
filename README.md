# AWS Lambda Typescript Boilerplate Code

Fork this repository to quickstart lambda development with typescript.

## TODO

- think about conventions if you deploy the same lambda function code to different 'instances' of lambda,
  e.g. if you have a stage and a prod lambda function in the same account

  - npm run stack stage

- Configuration
  per config file or everything in aws environment variables? npm run update:prod

## Commands

Configure settings in `lambda.json` or `lambda.config.js`

- `npm run stack` create or update a cloudformation stack for this lambda function
- `npm run update` update lambda function code (aka deploy)
- `npm run alias version tag` tag a version with an alias, e.g. set version to 'PROD'
- `npm run attach` attac

## Tools

- webpack for bundling and treeshaking
- jest for testing
- prettier to format code
- husky for automatically running tests before committing

## Hints

- start scripts from the scripts folder with [ts-node](https://github.com/TypeStrong/ts-node) scripts/stack.ts
