#!/usr/bin/env bash

set -euo pipefail

if ! command -v docker >/dev/null 2>&1; then
  echo "docker not found"
  exit 1
fi

cp -n .env.example .env || true
docker compose up -d
npm run prisma:generate
npx prisma migrate deploy
npm run start:dev
