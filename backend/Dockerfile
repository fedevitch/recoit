# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=22.14.0

FROM node:${NODE_VERSION}-alpine

ENV NODE_ENV=staging

WORKDIR /usr/src/app

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

# Copy the rest of the source files into the image.
COPY . .

# generate db related schemas
RUN npx prisma generate

# install jest for run tests
RUN npm i -g jest

# Run tests
RUN npm run test:cov

# install cli for making build    
RUN npm i -g @nestjs/cli

RUN npm run build

RUN npm prune --omit=dev

# Expose the port that the application listens on.
EXPOSE 3000

COPY ./docker-entrypoint.sh ./

RUN chmod +x docker-entrypoint.sh

# Run entrypoint script
ENTRYPOINT ["sh", "./docker-entrypoint.sh"]