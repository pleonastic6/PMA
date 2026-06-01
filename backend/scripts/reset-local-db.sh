#!/usr/bin/env bash

set -euo pipefail

if ! command -v docker >/dev/null 2>&1; then
  echo "docker not found"
  exit 1
fi

docker compose down -v
docker compose up -d
npx prisma migrate deploy
