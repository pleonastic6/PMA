# PMA Backend Cheatsheet

## Ziel

Wir bauen **kein Microservice-Museum**, sondern einen **modularen Monolithen**:

- ein Backend-Repo
- ein gemeinsames Deployment
- klare Modulgrenzen
- 10 Leute koennen parallel arbeiten

## Stack

- `NestJS` + `TypeScript`
- `PostgreSQL`
- `Redis`
- `WebSocket` oder `Socket.IO` fuer Chat
- `S3`-Storage fuer Bilder
- `REST API` fuer normale Endpunkte

## Architekturregel

Jedes Modul hat:

- eigene Routes/Controller
- eigene Service-Layer
- eigene Datenmodelle
- eigene Tests
- keine direkten Hacks in andere Module

## Module

1. `auth`
2. `users`
3. `profiles`
4. `discovery`
5. `matches`
6. `chat`
7. `events`
8. `location`
9. `verification_moderation`
10. `platform`

## Teamaufteilung

1. `platform`
   Repo-Setup, Docker, CI, Logging, Error-Handling, Swagger, Env-Handling
2. `auth`
   Register, Login, JWT, Refresh Tokens, Passwort-Hashing
3. `users`
   User-Basisdaten, Settings, Privacy, Notification-Settings
4. `profiles`
   Profil bearbeiten, Interessen, Bio, Bilder-Metadaten, Onboarding
5. `discovery`
   Filter, Radius, Alter, Interessen, Kandidatenliste
6. `matches`
   Swipes speichern, Match-Erzeugung, Match-Status
7. `chat`
   Konversationen, Nachrichten, Read-States, Realtime
8. `events`
   Events erstellen, listen, joinen, Event-Teilnehmer
9. `location`
   Positionen, Distanzsuche, Kartenabfragen, Geo-Logik
10. `verification_moderation`
   Reports, Blocks, Verification, Admin-Endpunkte

## Reihenfolge

### Phase 1: Fundament

- `platform`
- `auth`
- `users`
- `profiles`

Ziel:

- Login funktioniert
- User kann Profil anlegen und bearbeiten
- API laeuft stabil lokal und im Staging

### Phase 2: Kernprodukt

- `discovery`
- `matches`

Ziel:

- Kandidaten abrufen
- Swipen
- Matchs erzeugen

### Phase 3: Social Layer

- `chat`
- `events`
- `location`

Ziel:

- Nach Match schreiben
- Events planen und beitreten
- Kartenansicht sinnvoll anbinden

### Phase 4: Safety + Polish

- `verification_moderation`
- Rate Limits
- Audit Logs
- Abuse-Schutz

## Gemeinsame Regeln

- DB-Aenderungen nur per Migration
- API zuerst in Swagger/OpenAPI dokumentieren
- Keine ungetesteten DB-Queries in Controller packen
- Kein Copy-Paste von Logik ueber Modulgrenzen
- Ein Fehlerformat fuer alle Endpunkte
- Rollen frueh definieren: `user`, `admin`, optional `moderator`
- PRs klein halten
- Niemand arbeitet direkt auf `main`

## MVP Datenmodelle

- `User`
- `AuthIdentity`
- `Profile`
- `ProfileImage`
- `Preference`
- `Swipe`
- `Match`
- `Conversation`
- `Message`
- `Event`
- `EventParticipant`
- `Block`
- `Report`
- `VerificationRequest`
- `LocationSnapshot`

## MVP Endpunkte

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `GET /me`
- `PATCH /me/profile`
- `PATCH /me/preferences`
- `GET /discovery/candidates`
- `POST /swipes`
- `GET /matches`
- `GET /matches/:id/messages`
- `POST /matches/:id/messages`
- `GET /events`
- `POST /events`
- `POST /events/:id/join`
- `POST /reports`
- `POST /blocks`

## Technische Leitplanken

- Discovery zuerst simpel und deterministisch
  Alter, Radius, Interessen, Ausschluesse
- Chat in der DB speichern, Realtime nur fuer Zustellung
- Bilder nicht in Postgres speichern, nur URLs und Metadaten
- Geo-Suche mit `PostGIS`, nicht selbst zusammenfrickeln
- Verification von Anfang an im Modell mitdenken, aber nicht ueberbauen

## Was wir nicht machen

- keine 10 Microservices
- kein Kafka am Anfang
- kein GraphQL als erstes
- keine wilde KI-Matching-Engine im MVP
- keine Features ohne klare Ownership

## Definition of Done

Ein Ticket ist erst fertig, wenn:

- Code gemerged ist
- Tests laufen
- Swagger aktualisiert ist
- Migration sauber ist
- lokales Review durch war
- niemand beim Pull sofort flucht

## Empfehlung fuer den Start

Woche 1:

- `platform`, `auth`, `users`, `profiles`
- gemeinsames DB-Schema festziehen
- API-Konventionen festlegen

Woche 2:

- `discovery`, `matches`
- erste End-to-End Demo

Woche 3:

- `chat`, `events`, `location`

Woche 4:

- `moderation`, Bugs, Cleanup, Deploy-Stabilisierung

## Kurzfassung fuer die Wand

**Ein Backend. Klare Module. Kleine PRs. Erst Fundament, dann Swipes, dann Chat/Events, dann Safety.**
