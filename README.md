# aws-build-badges
Create build badges according to CodeBuild/CodePipeline states.
The badges are uploaded to S3 bucket, and then you can link to those badges (SVG files).

## Technology stack
1. [NodeJS 10.x](https://aws.amazon.com/about-aws/whats-new/2019/05/aws_lambda_adds_support_for_node_js_v10/) - AWS Lambda supports this version of NodeJS
1. [yarn](https://yarnpkg.com/lang/en/) - package manager (instead of npm)
1. [TypeScript 3.7](https://www.typescriptlang.org/) - targeting ES5
1. [ESLint](www.lalalal.com) - Linting TypeScript (src) and JavaScript (dist) files
1. [text-to-svg package](https://www.npmjs.com/package/text-to-svg) - creating SVG timestamp
1. [serverless-framework](https://serverless.com/) - packing the app and deploying to AWS
1. [Jest](https://jestjs.io/) - for testing - `yarn test`
1. [zip](https://linux.die.net/man/1/zip) - used in `yarn build`
1. [aws-vault](https://github.com/99designs/aws-vault) - securing AWS credentials

## Installation
1.  Download and install LTS version of [NodeJS](https://nodejs.org/en/)
1.  Download and install [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
1.  Clone this repo with git
    ```
    git clone https://github.com/unfor19/aws-build-badges.git
    cd ./aws-build-badges
    ```
1.  Download and install [yarn](https://yarnpkg.com/lang/en/docs/install/)
1.  Install [serverless-framework](https://serverless.com/framework/docs/providers/aws/guide/installation/) globally
    ```
    yarn global add serverless
    ```
1.  Install application dependencies
    ```
    yarn install
    ```
1.  Create a bucket for serverless deployments, and name it: `myapp-badges-deployment-STAGE`,
    where myapp is your app's name
    - For example: `myapp-badges-deployment-prod`
1.  (Optional) Download and install [aws-vault](https://github.com/99designs/aws-vault)
1.  (Beta - Not ready) Install layer dependencies
    ```
    cd layers/text-to-svg/nodejs
    yarn addlayer
    ```

## Variables
### .env
Copy `env` file to `.env` and modify the relevant variables.

These variables are releavnt only if you intend to run tests or aws-vault.
```
BUCKET_BADGES=myapp-bucket-for-testing # jest
VAULT_PROFILE_TESTING=myapp-dev        # aws-vault
VAULT_PROFILE_DEV=myapp-dev            # aws-vault
VAULT_PROFILE_STAGING=myapp-staging    # aws-vault
VAULT_PROFILE_PROD=myapp-prod          # aws-vault
```

### .serverless.vars.yml
Copy `serverless.vars.yml` to `.serverless.vars.yml` and modify the relevant variables. 

Find and replace "myapp" with your application's name. And of course do whatever changes you need so it fits your infrastructure.

## Scripts
```
yarn test:vault        - Run jest using aws-vault profile
yarn test:aws          - Run jest using AWS credentials and profiles
yarn build             - Compile ts to js and zip dist to dist.zip
yarn deploy:vault-STAGE  - Deploy to AWS using aws-vault profile
yarn deploy:aws-STAGE    - Deploy to AWS using AWS credentials and profiles
yarn destroy:vault-STAGE - Destroy stack using aws-vault profile
yarn destroy:aws-STAGE   - Destroy stack using AWS credentials and profiles
```

For example:
```
➜  aws-build-badges git:(master) yarn deploy:vault-dev 
yarn run v1.19.1
$ export $(cat .env) && aws-vault exec ${VAULT_PROFILE_DEV} -- sls deploy --verbose --stage=dev
Serverless: Packaging service...
Serverless: Uploading CloudFormation file to S3...
...
Done in 20.30s.
```

## Troubleshooting

### yarn test:vault
1. **Issue**: Fails with: `Invalid bucket name`.
   - **Solution**: Set the `BUCKET_BADGES` variable in `.env`
1. **Issue**: Failed to get credentials for jest
   - **Solution**: Set the `VAULT_PROFILE_TESTING` variable in `.env`
