FROM node:22.16.0-alpine AS base
# set working directory
WORKDIR /usr/src/app


# --------- Development stage ---------

FROM base AS development
# copy package.json and package-lock.json
COPY package.json package-lock.json ./
# install all dependencies (including devDependencies for tsc)
RUN npm ci
# copy source code
COPY . .
# start the application in development mode(override per service in docker-compose.yaml)
CMD ["npx", "tsx", "watch", "src/api/app.ts"]

# --------- Install dependencies stage ---------
FROM base AS install-deps
# copy package.json and package-lock.json
COPY package.json package-lock.json ./
# install production dependencies only
RUN npm ci --omit=dev

# --------- Build stage ---------
FROM base AS build
# install all dependencies (including devDependencies for tsc)
COPY package.json package-lock.json ./
RUN npm ci
# copy source code
COPY . .
# compile the application
RUN npm run compile

# --------- Runtime stage ---------
FROM base AS runtime
# copy production dependencies and compiled output from build stage
COPY --from=install-deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
# copy package.json
COPY package.json ./
# set environment variables
ENV NODE_ENV=production
# start the application (override per service in deployments configs)
CMD ["node", "dist/api/app.js"]
