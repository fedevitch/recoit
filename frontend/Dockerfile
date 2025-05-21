# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=22.14.0

FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /usr/src/app

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci  

# install dependencies for making build    
RUN npm install -g @angular/cli

# Copy the rest of the source files into the image.
COPY . .

RUN npm run build 

RUN apk add chromium
ENV CHROME_BIN=/usr/bin/chromium-browser
RUN npm run test:ci

FROM docker.io/nginx:1.27.4-alpine-slim

ARG APP_NAME=recoit-frontend

COPY --from=builder /usr/src/app/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /usr/src/app/dist/${APP_NAME}/browser /usr/share/nginx/html

COPY --from=builder /usr/src/app/coverage /usr/src/app/coverage

# Create NGINX cache directory
RUN mkdir -p /var/cache/nginx/client_temp
# Set ownership of NGINX cache directory
RUN chown -R nginx:nginx /var/cache/nginx

# Expose port 80
EXPOSE 80