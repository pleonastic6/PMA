# PMA Backend Documentation

## Zweck

Dieses Backend ist ein **modularer Monolith** auf Basis von `NestJS`, `TypeScript` und `Prisma`.
Es soll das MVP fuer eine Social-/Matching-App tragen, ohne in Microservice-Unsinn zu kippen.

Ziele:

- ein Repo
- ein Deployment
- klare Modulgrenzen
- nachvollziehbare Datenfluesse
- echtes MVP-Verhalten statt nur Scaffold-Endpunkte

## Technischer Stack

- `NestJS` fuer HTTP-API und Modulstruktur
- `Prisma` als ORM
- `PostgreSQL` als Hauptdatenbank
- `Redis` ist fuer spaetere Realtime-/Cache-Themen vorbereitet
- `JWT` fuer Authentifizierung
- `class-validator` und `class-transformer` fuer DTO-Validierung

## Einstieg

### Lokal mit eigener DB

```bash
cd backend
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate:dev
npm run start:dev
```

### Lokal mit Docker

```bash
cd backend
npm install
npm run start:local
```

Das erwartet:

- API auf `http://localhost:3001`
- globale Prefix-Route: `/api`
- Postgres auf `localhost:5432`
- Redis auf `localhost:6379`

## Wichtige Konfiguration

Die `.env` basiert auf [backend/.env.example](/root/.openclaw/workspace/PMA/backend/.env.example).

Wichtige Variablen:

- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `ACCESS_TOKEN_TTL`
- `REFRESH_TOKEN_TTL`
- `CORS_ORIGIN`
- `PORT`

Die Config wird beim Start validiert. Fehlende Pflichtwerte fuehren direkt zu einem Startfehler statt spaeterem Chaos.

## Grundarchitektur

### Plattform-Layer

Dateien:

- [backend/src/main.ts](/root/.openclaw/workspace/PMA/backend/src/main.ts)
- [backend/src/modules/platform/app.module.ts](/root/.openclaw/workspace/PMA/backend/src/modules/platform/app.module.ts)

Globale Features:

- Prefix `/api`
- `helmet`
- CORS
- globale DTO-Validierung
- globales Fehlerformat
- Request-Logging
- rollenbasierter Guard als Basis fuer Moderation/Admin

### Response-Format

Erfolgreiche Antworten kommen ueber `ok(moduleName, data)` und sehen grob so aus:

```json
{
  "data": { "...": "..." },
  "meta": {
    "module": "auth"
  }
}
```

Fehlerantworten kommen ueber den globalen Exception-Filter:

```json
{
  "error": {
    "statusCode": 400,
    "message": "endsAt must be after startsAt",
    "path": "/api/events",
    "timestamp": "2026-06-01T12:34:56.000Z"
  }
}
```

## Authentifizierung

### JWT-Modell

- Access Token fuer normale API-Zugriffe
- Refresh Token fuer Token-Erneuerung
- Refresh Token wird gehasht in `AuthIdentity.refreshTokenHash` gespeichert

### Auth-Flow

1. `POST /api/auth/register`
   erstellt User, Profil und Preferences
2. `POST /api/auth/login`
   validiert Passwort und liefert frische Tokens
3. `POST /api/auth/refresh`
   prueft Refresh Token und stellt neue Tokens aus
4. `POST /api/auth/logout`
   loescht das gespeicherte Refresh-Token-Hash

Geschuetzte Routen nutzen den `JwtAuthGuard`.

## Datenmodell

Zentrale Datei:

- [backend/prisma/schema.prisma](/root/.openclaw/workspace/PMA/backend/prisma/schema.prisma)

### Kernmodelle

- `User`
  Basisobjekt fuer alle Nutzer
- `AuthIdentity`
  Passwort-Hash und Refresh-Token-Hash
- `Profile`
  Bio, Alter, Ort, Onboarding-Status
- `ProfileImage`
  Bild-URLs und Reihenfolge
- `Preference`
  Alter, Radius, Interessen, Notifications

### Matching-/Social-Modelle

- `Swipe`
  einseitige Like/Pass-Entscheidung
- `Match`
  entsteht bei gegenseitigem `LIKE`
- `Message`
  Nachrichten innerhalb eines Matches
- `Event`
  vom User erstelltes Event
- `EventParticipant`
  Teilnehmer eines Events

### Moderationsmodelle

- `Block`
  blockierte Nutzerbeziehung
- `Report`
  Meldung gegen einen anderen Nutzer

### Enums

- `UserRole`: `USER`, `ADMIN`, `MODERATOR`
- `VerificationStatus`: `UNVERIFIED`, `PENDING`, `VERIFIED`, `REJECTED`
- `SwipeDirection`: `LIKE`, `PASS`
- `ReportReason`: `HARASSMENT`, `SPAM`, `FAKE_PROFILE`, `INAPPROPRIATE_CONTENT`, `HATE_SPEECH`, `OTHER`
- `ReportStatus`: `OPEN`, `REVIEWING`, `RESOLVED`, `REJECTED`

## Module

### `platform`

Zweck:

- Root-Info
- Health
- Readiness
- Moduluebersicht

Routen:

- `GET /api/`
- `GET /api/platform/health`
- `GET /api/platform/ready`
- `GET /api/platform/modules`

Unterschied:

- `health` prueft nur, ob die App selbst lebt
- `ready` macht einen echten DB-Check via `SELECT 1`

### `auth`

Zweck:

- Registrierung
- Login
- Token-Refresh
- Logout

Routen:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`

Wichtige Regeln:

- E-Mail wird normalisiert
- Passwort wird mit `bcryptjs` gehasht
- fehlende JWT-Secrets lassen Auth hart scheitern

### `users`

Zweck:

- aktueller Nutzer
- aktuelle Preferences

Routen:

- `GET /api/me`
- `PATCH /api/me/preferences`

Wichtige Regeln:

- `minAge > maxAge` wird abgelehnt
- Preferences werden per `upsert` gespeichert

### `profiles`

Zweck:

- aktuelles Profil lesen
- Profil aktualisieren

Routen:

- `GET /api/me/profile`
- `PATCH /api/me/profile`

Wichtige Felder:

- `bio`
- `age`
- `city`
- `onboardingComplete`

### `discovery`

Zweck:

- Kandidaten fuer Swipe-Flow liefern

Route:

- `GET /api/discovery/candidates`

Discovery-Regeln:

- eigener User wird ausgeschlossen
- bereits geswipte User werden ausgeschlossen
- bereits gematchte User werden ausgeschlossen
- geblockte/blockierende User werden ausgeschlossen
- nur aktive User mit abgeschlossenem Onboarding kommen rein
- Altersfilter richtet sich nach `Preference`
- Reihenfolge ist erstmal deterministisch, nicht „smarte KI“

### `matches`

Zweck:

- Swipes speichern
- Matches liefern
- Match-Erzeugung

Routen:

- `POST /api/swipes`
- `GET /api/matches`

Swipe-Regeln:

- Self-Swipe verboten
- Swipe gegen geblockte Nutzer verboten
- Zielprofil muss aktiv und onboarding-fertig sein
- `LIKE` + gegenseitiger `LIKE` erzeugt `Match`
- Match-Paare werden sortiert gespeichert, damit keine Dubletten entstehen

### `chat`

Zweck:

- Konversationsliste
- Nachrichten innerhalb eines Matches

Routen:

- `GET /api/conversations`
- `GET /api/matches/:id/messages`
- `POST /api/matches/:id/messages`

Chat-Regeln:

- Chat existiert nicht separat, sondern haengt direkt an `Match`
- nur Match-Teilnehmer duerfen lesen/schreiben
- beim Lesen werden fremde ungelesene Nachrichten auf `readAt` gesetzt
- Konversationsliste liefert pro Match den letzten Message-Snapshot

### `events`

Zweck:

- Events listen
- Events erstellen
- Events joinen

Routen:

- `GET /api/events`
- `POST /api/events`
- `POST /api/events/:id/join`

Event-Regeln:

- `startsAt` muss in der Zukunft liegen
- `endsAt` muss nach `startsAt` liegen
- Creator wird automatisch erster Teilnehmer
- doppelte Teilnahme ist verboten
- volle Events koennen nicht gejoint werden
- abgelaufene Events koennen nicht gejoint werden
- Blockstatus zwischen User und Creator verhindert Join
- Eventliste filtert blockierte/blockierende Creator und Teilnehmer raus

### `verification-moderation`

Zweck:

- Blocks
- Reports
- Moderationsgrundlagen

Routen:

- `GET /api/verification-moderation/overview`
- `GET /api/verification-moderation/blocks`
- `POST /api/verification-moderation/blocks`
- `DELETE /api/verification-moderation/blocks/:blockedUserId`
- `GET /api/verification-moderation/reports/mine`
- `POST /api/verification-moderation/reports`
- `GET /api/verification-moderation/reports`

Rollenlogik:

- `GET /api/verification-moderation/reports` ist nur fuer `ADMIN` oder `MODERATOR`

Block-Regeln:

- Self-Block verboten
- beim Blocken werden bestehende Swipes in beide Richtungen geloescht
- beim Blocken werden bestehende Matches zwischen beiden Seiten geloescht
- Discovery, Swipes und Event-Interaktionen respektieren Blocks

Report-Regeln:

- Self-Report verboten
- Report hat `reason`, optionale `details` und `status`
- bei Erstellung wird auch zurueckgegeben, ob bereits ein Block existiert

### `location`

Aktuell noch Platzhalter.

Route:

- `GET /api/location/nearby`

## Wichtige Flows

### 1. Neuer User

1. `POST /api/auth/register`
2. Tokens erhalten
3. `PATCH /api/me/profile`
4. `PATCH /api/me/preferences`
5. `onboardingComplete` auf `true`
6. User taucht in Discovery anderer Nutzer auf

### 2. Match entsteht

1. User A ruft Discovery auf
2. User A sendet `POST /api/swipes`
3. User B liked spaeter User A
4. Backend erkennt gegenseitigen `LIKE`
5. `Match` wird erzeugt
6. beide sehen das Match in `GET /api/matches`

### 3. Chat nach Match

1. Match existiert
2. `POST /api/matches/:id/messages`
3. Konversation erscheint in `GET /api/conversations`
4. `GET /api/matches/:id/messages` markiert eingegangene Messages als gelesen

### 4. Event-Nutzung

1. User erstellt Event ueber `POST /api/events`
2. Event erscheint in `GET /api/events`
3. andere User koennen `POST /api/events/:id/join`
4. Kapazitaet und Blockstatus werden geprueft

### 5. Moderation

1. User blockt anderen User
2. Swipes/Match zwischen beiden werden entfernt
3. beide tauchen nicht mehr in Discovery/Event-Kontexten des anderen auf
4. alternativ oder zusaetzlich kann ein Report erstellt werden

## Migrations

Vorhandene manuelle SQL-Migrationen:

- `20260601_init`
- `20260601_swipes_matches`
- `20260601_messages`
- `20260601_events`
- `20260601_blocks`
- `20260601_reports`

Pfad:

- [backend/prisma/migrations](/root/.openclaw/workspace/PMA/backend/prisma/migrations)

## Sicherheit und Guards

- `JwtAuthGuard` schuetzt private Endpunkte
- `RolesGuard` ist global registriert
- `@Roles('ADMIN', 'MODERATOR')` ist fuer Moderations-Endpunkte vorgesehen
- `helmet` setzt Basis-Security-Header

## Noch nicht fertig

Diese Teile sind noch nicht wirklich umgesetzt:

- Swagger/OpenAPI
- Tests
- echte Geo-/PostGIS-Logik
- WebSocket-/Socket.IO-Realtime
- Verification-Workflows
- Report-Status-Updates durch Moderatoren
- Admin-Endpunkte fuer Moderationsaktionen
- Seed-Skripte

## Empfohlene nächste Schritte

1. Seed-Datei fuer Demo-User, Demo-Matches und Demo-Events bauen
2. Swagger dazu, damit Frontend/Team nicht im Blindflug arbeitet
3. Tests fuer Auth, Match, Block und Report-Flows
4. Report-Review-Endpunkte fuer Moderatoren
5. Location sauber mit PostGIS modellieren
