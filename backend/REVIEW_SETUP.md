# PMA Backend Review Setup

## Ziel

Diese Anleitung ist dafuer da, das Backend **lokal sauber zu starten** und danach die wichtigsten Flows **systematisch zu reviewen**.

Wenn du einfach nur wissen willst, was du in welche Konsole eintippen musst: genau dafuer ist diese Datei.

## Was du brauchst

Vorher checken:

- `node` installiert
- `npm` installiert
- `docker` installiert
- `docker compose` installiert

Kurz testen:

```bash
node -v
npm -v
docker --version
docker compose version
```

Wenn einer der Befehle kaputt ist, erst das fixen. Sonst brauchst du gar nicht anfangen.

## Wie viele Terminals?

Empfehlung:

- **Terminal 1**: Docker / Datenbank
- **Terminal 2**: Backend
- **Terminal 3**: API-Tests mit `curl`

Optional:

- **Terminal 4**: zweiter User / parallel testen

Mit 3 Terminals kommst du sauber durch.

## Ordner

Wir arbeiten immer in:

```bash
cd /root/.openclaw/workspace/PMA/backend
```

## Einmalige Vorbereitung

### 1. In den Backend-Ordner gehen

In **Terminal 1**:

```bash
cd /root/.openclaw/workspace/PMA/backend
```

### 2. `.env` anlegen

Falls noch nicht vorhanden:

```bash
cp .env.example .env
```

### 3. Dependencies installieren

```bash
npm install
```

### 4. Prisma Client generieren

```bash
npm run prisma:generate
```

## Terminal 1: Datenbank starten

In **Terminal 1**:

```bash
cd /root/.openclaw/workspace/PMA/backend
docker compose up -d
```

Danach checken:

```bash
docker compose ps
```

Du willst sehen:

- `postgres` running
- `redis` running

Wenn das nicht laeuft, brauchst du mit dem Review nicht weitermachen.

## Terminal 2: Migrationen und Backend starten

In **Terminal 2**:

```bash
cd /root/.openclaw/workspace/PMA/backend
```

### 1. Migrationen einspielen

Erst das:

```bash
npm run prisma:migrate:deploy
```

Wenn das zickt, alternativ:

```bash
npm run prisma:migrate:dev
```

### 2. Backend starten

```bash
npm run start:dev
```

Das Terminal jetzt **offen lassen**.

Wenn alles ok ist, laeuft das Backend auf:

```text
http://localhost:3001
```

## Terminal 3: Health-Checks

In **Terminal 3**:

```bash
cd /root/.openclaw/workspace/PMA/backend
```

### 1. Liveness testen

```bash
curl http://localhost:3001/api/platform/health
```

Erwartung:

- JSON-Antwort
- `status: ok`

### 2. Readiness testen

```bash
curl http://localhost:3001/api/platform/ready
```

Erwartung:

- JSON-Antwort
- DB erreichbar

Wenn schon das nicht geht, nicht weiter mit User-Flows. Erst Backend-Fix.

## Review-Strategie

Du brauchst fuer sinnvolle Tests **mindestens 3 User**:

- `user-a`
- `user-b`
- `user-c`

Warum 3?

- A und B fuer Match/Chat
- C fuer Block/Report/Event-Kombinationen

## Testdaten-Vorschlag

Nimm z. B.:

- `a@example.com`
- `b@example.com`
- `c@example.com`

Passwort fuer alle:

- `Passwort123`

## User anlegen

### User A registrieren

In **Terminal 3**:

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "a@example.com",
    "password": "Passwort123",
    "displayName": "User A"
  }'
```

Wichtig:

- Aus der Antwort den `accessToken` kopieren

Speicher ihn in Terminal 3:

```bash
export TOKEN_A="HIER_DEN_ACCESS_TOKEN_EINFUEGEN"
```

### User B registrieren

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "b@example.com",
    "password": "Passwort123",
    "displayName": "User B"
  }'
```

Dann:

```bash
export TOKEN_B="HIER_DEN_ACCESS_TOKEN_EINFUEGEN"
```

### User C registrieren

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "c@example.com",
    "password": "Passwort123",
    "displayName": "User C"
  }'
```

Dann:

```bash
export TOKEN_C="HIER_DEN_ACCESS_TOKEN_EINFUEGEN"
```

## User-IDs holen

### User A

```bash
curl http://localhost:3001/api/me \
  -H "Authorization: Bearer $TOKEN_A"
```

Die `id` notieren.

```bash
export USER_A_ID="HIER_ID_EINFUEGEN"
```

### User B

```bash
curl http://localhost:3001/api/me \
  -H "Authorization: Bearer $TOKEN_B"
```

```bash
export USER_B_ID="HIER_ID_EINFUEGEN"
```

### User C

```bash
curl http://localhost:3001/api/me \
  -H "Authorization: Bearer $TOKEN_C"
```

```bash
export USER_C_ID="HIER_ID_EINFUEGEN"
```

## Profile vorbereiten

Damit Discovery ueberhaupt sinnvoll funktioniert, muessen die Profile fertig sein.

### User A Profil

```bash
curl -X PATCH http://localhost:3001/api/me/profile \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d '{
    "bio": "Ich bin User A",
    "age": 24,
    "city": "Berlin",
    "onboardingComplete": true
  }'
```

### User B Profil

```bash
curl -X PATCH http://localhost:3001/api/me/profile \
  -H "Authorization: Bearer $TOKEN_B" \
  -H "Content-Type: application/json" \
  -d '{
    "bio": "Ich bin User B",
    "age": 25,
    "city": "Berlin",
    "onboardingComplete": true
  }'
```

### User C Profil

```bash
curl -X PATCH http://localhost:3001/api/me/profile \
  -H "Authorization: Bearer $TOKEN_C" \
  -H "Content-Type: application/json" \
  -d '{
    "bio": "Ich bin User C",
    "age": 26,
    "city": "Berlin",
    "onboardingComplete": true
  }'
```

## Preferences vorbereiten

### User A

```bash
curl -X PATCH http://localhost:3001/api/me/preferences \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d '{
    "minAge": 18,
    "maxAge": 40,
    "maxDistanceKm": 50,
    "interestTags": ["tech", "study"],
    "notificationsEnabled": true
  }'
```

### User B

```bash
curl -X PATCH http://localhost:3001/api/me/preferences \
  -H "Authorization: Bearer $TOKEN_B" \
  -H "Content-Type: application/json" \
  -d '{
    "minAge": 18,
    "maxAge": 40,
    "maxDistanceKm": 50,
    "interestTags": ["music"],
    "notificationsEnabled": true
  }'
```

### User C

```bash
curl -X PATCH http://localhost:3001/api/me/preferences \
  -H "Authorization: Bearer $TOKEN_C" \
  -H "Content-Type: application/json" \
  -d '{
    "minAge": 18,
    "maxAge": 40,
    "maxDistanceKm": 50,
    "interestTags": ["sports"],
    "notificationsEnabled": true
  }'
```

## Review-Checkliste

## 1. Discovery testen

Mit User A:

```bash
curl http://localhost:3001/api/discovery/candidates \
  -H "Authorization: Bearer $TOKEN_A"
```

Erwartung:

- User B und C koennen auftauchen
- User A selbst nicht

## 2. Match testen

### A liked B

```bash
curl -X POST http://localhost:3001/api/swipes \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d "{
    \"targetUserId\": \"$USER_B_ID\",
    \"direction\": \"LIKE\"
  }"
```

### B liked A

```bash
curl -X POST http://localhost:3001/api/swipes \
  -H "Authorization: Bearer $TOKEN_B" \
  -H "Content-Type: application/json" \
  -d "{
    \"targetUserId\": \"$USER_A_ID\",
    \"direction\": \"LIKE\"
  }"
```

### Matches abrufen

```bash
curl http://localhost:3001/api/matches \
  -H "Authorization: Bearer $TOKEN_A"
```

Erwartung:

- A sieht Match mit B

Jetzt `matchId` aus der Antwort notieren:

```bash
export MATCH_AB_ID="HIER_MATCH_ID_EINFUEGEN"
```

## 3. Chat testen

### A sendet Nachricht

```bash
curl -X POST http://localhost:3001/api/matches/$MATCH_AB_ID/messages \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Hallo von A"
  }'
```

### B liest Nachrichten

```bash
curl http://localhost:3001/api/matches/$MATCH_AB_ID/messages \
  -H "Authorization: Bearer $TOKEN_B"
```

### Konversationen anzeigen

```bash
curl http://localhost:3001/api/conversations \
  -H "Authorization: Bearer $TOKEN_B"
```

## 4. Event testen

### A erstellt Event

```bash
curl -X POST http://localhost:3001/api/events \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Kaffee in Berlin",
    "description": "Kurzes Treffen zum Quatschen",
    "locationLabel": "Berlin Mitte",
    "startsAt": "2026-12-01T18:00:00.000Z",
    "endsAt": "2026-12-01T20:00:00.000Z",
    "capacity": 3
  }'
```

`eventId` notieren:

```bash
export EVENT_ID="HIER_EVENT_ID_EINFUEGEN"
```

### B joint Event

```bash
curl -X POST http://localhost:3001/api/events/$EVENT_ID/join \
  -H "Authorization: Bearer $TOKEN_B"
```

### Eventliste abrufen

```bash
curl http://localhost:3001/api/events \
  -H "Authorization: Bearer $TOKEN_B"
```

## 5. Block testen

### A blockt C

```bash
curl -X POST http://localhost:3001/api/verification-moderation/blocks \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d "{
    \"blockedUserId\": \"$USER_C_ID\",
    \"reason\": \"Test block\"
  }"
```

### Blockliste von A

```bash
curl http://localhost:3001/api/verification-moderation/blocks \
  -H "Authorization: Bearer $TOKEN_A"
```

### Discovery nochmal pruefen

```bash
curl http://localhost:3001/api/discovery/candidates \
  -H "Authorization: Bearer $TOKEN_A"
```

Erwartung:

- C darf fuer A nicht mehr auftauchen

## 6. Report testen

### B meldet C

```bash
curl -X POST http://localhost:3001/api/verification-moderation/reports \
  -H "Authorization: Bearer $TOKEN_B" \
  -H "Content-Type: application/json" \
  -d "{
    \"targetUserId\": \"$USER_C_ID\",
    \"reason\": \"SPAM\",
    \"details\": \"Test report\"
  }"
```

### Eigene Reports anzeigen

```bash
curl http://localhost:3001/api/verification-moderation/reports/mine \
  -H "Authorization: Bearer $TOKEN_B"
```

## Was du dabei reviewen solltest

Nicht nur schauen, ob es „irgendwie geht“. Schau gezielt auf:

- kommt HTTP 200/201 oder kommt unerwartet 400/401/500?
- ist die Response logisch und konsistent?
- funktionieren Guards wirklich?
- kann man fremde Match-Chats lesen?
- greifen Blocks wirklich in Discovery/Events/Swipes?
- entstehen Matches nur bei gegenseitigem `LIKE`?
- werden Events korrekt gejoint/geblockt?

## Wenn du neu anfangen willst

### Datenbank hart zuruecksetzen

In **Terminal 1**:

```bash
cd /root/.openclaw/workspace/PMA/backend
docker compose down -v
docker compose up -d
```

Dann in **Terminal 2**:

```bash
cd /root/.openclaw/workspace/PMA/backend
npm run prisma:migrate:deploy
npm run start:dev
```

## Typische Fehler

### `Connection refused`

Heisst meistens:

- Backend laeuft nicht
- Docker/Postgres laeuft nicht

### `Invalid environment configuration`

Heisst:

- `.env` fehlt
- oder Pflichtwert in `.env` fehlt

### `Unauthorized`

Heisst meistens:

- `Authorization: Bearer <token>` fehlt
- oder falscher Token

### `Match not found`

Heisst:

- Match-ID ist falsch
- oder User ist nicht Teilnehmer

### `Event is full` oder `Already joined`

Das ist kein Bug, sondern gewollte Logik.

## Meine Empfehlung fuer dein Review

Mach es in genau dieser Reihenfolge:

1. Health
2. Register/Login
3. Profil + Preferences
4. Discovery
5. Swipes + Match
6. Chat
7. Events
8. Block
9. Report

Wenn ein frueher Schritt kaputt ist, nicht sinnlos spaetere Schritte debuggen.
