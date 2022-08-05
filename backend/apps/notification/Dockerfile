# Local Development
FROM node:18 As development

RUN apt-get update && apt-get install -y openssl

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . .

RUN npm run prisma:generate

# Build for Production
FROM node:18-alpine As build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN npm run build notification

ENV NODE_ENV production

RUN npm ci --only=pro3duction && npm cache clean --force

# Production
FROM node:18-alpine As production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist


CMD ["node", "dist/apps/notification/main"]




# FROM node:18-slim As development

# RUN apt-get update && apt-get install -y openssl

# WORKDIR /usr/src/app

# COPY package*.json ./
# COPY prisma ./prisma/

# RUN npm install

# COPY . .

# RUN npm run prisma:generate

# RUN npm run build

# FROM node:18-alpine As production

# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}

# WORKDIR /usr/src/app

# COPY package*.json ./
# COPY prisma ./prisma/

# RUN npm install --only=production

# COPY . .

# COPY --from=development /usr/src/app/node_modules ./node_modules
# COPY --from=development /usr/src/app/package*.json ./
# COPY --from=development /usr/src/app/dist ./dist
# COPY --from=development /usr/src/app/prisma ./prisma

# EXPOSE 4000
# CMD ["node", "dist/apps/todos/main"]


