## **Description**

NestJS application that implements a Microservice architecture with RabbitMQ as the message-broker. All services are ran inside of their own Docker container and each service communicate with each other with the help of RabbitMQ.

**implement:**

- **NestJS Redis Caching:** https://www.tomray.dev/nestjs-caching-redis
- **NEST to EC2 with CI/CD:** https://moduscreate.com/blog/deploy-a-nestjs-application-to-amazon-ecs-using-codepipeline/
- **Nest RBAC:** https://www.youtube.com/watch?v=xd3LJqdU1ig
- **Astro:** https://www.youtube.com/watch?v=PSzCtdM20Fc&ab_channel=JackHerrington

**Websockets & React-query:** https://tkdodo.eu/blog/using-web-sockets-with-react-query

Combine:

https://www.youtube.com/watch?v=xMsJPnjiRAc

<br />

### **1. Install Dependencies**

Install NestJS CLI

```bash
npm i -g @nestjs/cli
```

Install the dependencies for the Nest applications:

```bash
cd ./backend && npm install
```

Install the dependencies for the Frontend application:

```bash
cd ./frontend && npm install
```

### **2. AWS Cognito**

Follow the images and steps in the [tutorial](https://medium.com/weekly-webtips/authentication-with-aws-cognito-and-nestjs-9f04c766f3fd) on how to setup AWS Cognito (not the code parts). (Remember to create a serverless function in AWS that auto confirms every user, otherwise you'll have to do it manually).

### **3. Environment Variables**

Set environment variables in the .env file. Start by copying the required variables from the .env.example file to the .env file by running the command below and then changing the values inside the .env file:

```bash
# Copies the content from the .env.example to a new .env file
cp .env.example .env
```

Run the same command "cp .env.example .env" for all the files in the folders marked below. Remember to insert the correct values for the environment variables in their own files, but don't change the environment variables that have pre-filled values.

```
├── backend/
│   └── .env.example  <–––
├── backend/apps/todos
│   └── .env.example  <–––
├── backend/apps/notification
│   └── .env.example  <–––
├── backend/apps/auth
│   └── .env.example  <–––
├── frontend/
└── ...
```

### **4. Start Application With Docker**

```bash
docker-compose up --build
```

(remove "--build" flag once project has been built once.)

```bash
docker-compose up
```

### **5. Prisma & Postgres**

Run commands below with Docker CLI to run migrations.

```bash
npx prisma migrate dev
```

Run commands below in ./backend to update node_modules and prisma types

```bash
cd backend && npm install
```

**Important:** "npx prisma db seed" does not work since they depend on AWS Cognito users which are not made.

</br>

## **Credits & Guides:**

- [NestJS, Redis and Postgres local development with Docker Compose.](https://www.tomray.dev/nestjs-docker-compose-postgres)
- [Build Nest.js Microservices With RabbitMQ, MongoDB & Docker | Tutorial.](https://www.youtube.com/watch?v=yuVVKB0EaOQ&t=4288s)
- [Authentication with AWS Cognito and NestJS](https://medium.com/weekly-webtips/authentication-with-aws-cognito-and-nestjs-9f04c766f3fd)
