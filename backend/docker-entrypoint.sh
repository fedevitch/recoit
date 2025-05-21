#!/bin/sh

# Fail if any command fails
set -e

echo $NODE_ENV

if [ -f .env.${NODE_ENV} ]; then
  export $(grep -v '^#' .env.${NODE_ENV} | xargs)
  cp -R .env.${NODE_ENV} .env
fi

echo "[entrypoint] Starting NestJS setup..."

echo "[entrypoint] Running migrations..."
# Run Prisma migrations
npm run migrate:staging

echo "[entrypoint] Starting NestJS..."
# Start the API server
npm run start:prod
