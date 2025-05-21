#!/bin/sh

# Fail if any command fails
set -e

echo $NODE_ENV

if [ -f .env.${NODE_ENV} ]; then
  export $(grep -v '^#' .env.${NODE_ENV} | xargs)
  cp -R .env.${NODE_ENV} .env
  echo "env file copied successfully"
else
  echo "[entrypoint] WARNING: $ENV_FILE not found. Continuing without copying env file."
fi

echo "[entrypoint] Starting NestJS..."
# Start the API server
npm run start:prod
