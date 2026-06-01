# PMA Backend

NestJS-basierter modularer Monolith nach dem Plan aus [BACKEND_CHEATSHEET.md](../BACKEND_CHEATSHEET.md).

## Ziele

- ein Backend-Repo
- ein Deployment
- klare Modulgrenzen
- Teamarbeit ohne Modulchaos

## Struktur

- `src/modules/platform`: Plattform-Basis, Health, App-Metadaten
- `src/modules/auth`: Login/Register/JWT-Skelett
- `src/modules/users`: User-Basisdaten und Settings
- `src/modules/profiles`: Profilpflege und Onboarding
- `src/modules/discovery`: Kandidaten und Filter
- `src/modules/matches`: Swipes und Matches
- `src/modules/chat`: Konversationen und Nachrichten
- `src/modules/events`: Events und Teilnahme
- `src/modules/location`: Geo-Endpunkte
- `src/modules/verification-moderation`: Reports, Blocks, Verification

## Start

```bash
cd backend
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate:dev
npm run start:dev
```

Standard-Port: `3001`

## Lokales Full Setup

Wenn `docker` installiert ist:

```bash
cd backend
npm install
npm run start:local
```

Das startet:

- `Postgres` auf `localhost:5432`
- `Redis` auf `localhost:6379`
- Backend auf `localhost:3001`

Zusaetzlich gibt es jetzt:

- `GET /api/platform/health` fuer simplen Liveness-Check
- `GET /api/platform/ready` fuer DB-Readiness
- `POST /api/auth/logout` zum Invalidieren von Refresh-Tokens

Wenn Docker fehlt, kannst du trotzdem mit einer bestehenden lokalen Postgres-Instanz arbeiten und danach `npm run prisma:migrate:deploy` ausfuehren.

## Nächste sinnvolle Schritte

1. `platform`: Logging, Error-Handling, Swagger, Docker, CI
2. `auth`: JWT, Refresh Tokens, Passwort-Hashing, Guards
3. `users` und `profiles`: Persistenz, DTOs, Validierung, Migrations
4. Datenbank und Redis anbinden
