## Description

NestJS application that implements a Microservice architecture with RabbitMQ as the message-broker. All services are ran inside of their own Docker container and each service communicate with each other with the help of RabbitMQ.

implement: https://www.tomray.dev/nestjs-caching-redis

### 1. Install Dependencies

Install NestJS CLI

```bash
npm i -g @nestjs/cli
```

Install the dependencies for the Nest application:

```bash
npm install
```

### 2. Environment Variables

Set environment variables in the .env file. Start by copying the required variables from the .env.example file to the .env file by running the command below and then changing the values inside the .env file:

```bash
cp .env.example .env
```

### 3. Start Application With Docker

```bash
docker-compose up --build
```

### 4. Prisma Migrate

**Run commands below with Docker CLI to run initial migrations & seed database with data.**

```bash
npx prisma migrate dev && npx prisma db seed
```

[Prisma Migrate](https://github.com/prisma/prisma2/tree/master/docs/prisma-migrate) is used to manage the schema and migration of the database. Prisma datasource requires an environment variable `DATABASE_URL` for the connection to the PostgreSQL database. Prisma reads the `DATABASE_URL` from the root [.env](./.env) file.

Use Prisma Migrate in your [development environment](https://www.prisma.io/blog/prisma-migrate-preview-b5eno5g08d0b#evolving-the-schema-in-development) to

1. Creates `migration.sql` file
2. Updates Database Schema
3. Generates Prisma Client

```bash
npx prisma migrate dev
# or
npm run migrate:dev
```

If you like to customize your `migration.sql` file run the following command. After making your customizations run `npx prisma migrate dev` to apply it.

```bash
npx prisma migrate dev --create-only
# or
npm run migrate:dev:create
```

If you are happy with your database changes you want to deploy those changes to your [production database](https://www.prisma.io/blog/prisma-migrate-preview-b5eno5g08d0b#applying-migrations-in-production-and-other-environments). Use `prisma migrate deploy` to apply all pending migrations, can also be used in CI/CD pipelines as it works without prompts.

```bash
npx prisma migrate deploy
# or
npm run migrate:deploy
```

### 5. Prisma: Prisma Client JS

[Prisma Client JS](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/api) is a type-safe database client auto-generated based on the data model.

Generate Prisma Client JS by running

> **Note**: Every time you update [schema.prisma](prisma/schema.prisma) re-generate Prisma Client JS

```bash
npx prisma generate
# or
npm run prisma:generate
```

### 6. Seed the database data with this script

Execute the script with this command:

```bash
npx prisma db seed
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

#### Good reads:

- https://www.tomray.dev/nestjs-docker-compose-postgres
- https://stackoverflow.com/questions/66160753/should-i-run-prisma-migrate-on-every-app-start
