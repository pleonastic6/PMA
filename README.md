# PMA

PMA ist ein MVP für soziales Kennenlernen mit Registrierung, Profilen, Personenentdeckung, Matches, Chat, Events und Kartenansicht.

## Technik
- Frontend: React + React Router + Tailwind + React Leaflet
- Backend: Node.js + Express + MongoDB + Mongoose
- Tests: `node --test` mit `mongodb-memory-server`

## MVP-Funktionen
- Registrierung und Login mit Session-Token
- Profilpflege mit erweiterten Feldern, Galerie und Swipe-Präferenzen
- Entdeckungsübersicht mit Like/Pass
- Gegenseitige Likes erzeugen Matches
- Öffentliche Profilansicht für andere Nutzer innerhalb der App
- Chat nur zwischen Matches
- Events erstellen, bearbeiten, löschen und filtern
- Karte mit Event-Markern und anonymisierten Nutzerzonen
- Orts- und Stadtvorschläge über Nominatim/OSM

## Projektstruktur
- `src/frontend/app` React-Frontend
- `src/backend` Express-API
- `docs/scrum` Scrum-Artefakte, Sprintdokumente und Projektziele
- `docs/requirements` Nutzergeschichten und Personas
- `docs/architecture` Architekturübersicht, Diagramme und ADR
- `docs/user-manual` kompakter Bedienleitfaden
- `docs/presentation` OTH-Beamer-Präsentation

## Schnellstart

### 1. MongoDB-Datenordner anlegen

```bash
mkdir -p data/mongodb
```

### 2. MongoDB starten
Starte MongoDB aus dem Projektverzeichnis:

```bash
mongod --dbpath ./data/mongodb
```

Oder eine bestehende MongoDB-Instanz verwenden.

### 3. Backend konfigurieren

```bash
cd src/backend
cp .env.example .env
npm install
```

Wichtige Variable in `.env`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/pma
```

### 4. Demo-Daten laden

```bash
npm run seed:demo
```

Das Script leert die relevanten Collections und legt Demo-User, Matches, Chats und Events neu an.

### 5. Backend starten

```bash
npm run dev
```

Das Backend läuft dann standardmäßig auf `http://localhost:5000`.

### 6. Frontend starten

```bash
cd ../frontend/app
npm install
npm start
```

Das Frontend läuft standardmäßig auf `http://localhost:3000`.

## Demo-Accounts
- `neo / demo12345`
- `trinity / demo12345`
- `morpheus / demo12345`
- `switch / demo12345`

## Empfohlener Demo-Ablauf
1. Mit `neo` einloggen.
2. Profil kurz zeigen, inklusive Galerie und Interessen/Sprachen.
3. `Swipe` öffnen und die Karten mit Mehrfach-Slides erklären.
4. `Matches` öffnen, vorhandene Matches zeigen und ein Profil aufrufen.
5. In `Chat` die Demo-Unterhaltung mit `trinity` zeigen.
6. In `Events` die vorhandenen Events samt Filtern zeigen.
7. Optional neues Event anlegen oder ein bestehendes bearbeiten.
8. In `Map` die Event-Marker und Nutzerzonen zeigen.

## Nützliche Befehle

### Backend

```bash
npm run dev
npm test
npm run seed:demo
```

### Frontend

```bash
npm start
npm run build
```

## Verifikation
- Backend-Tests:

```bash
cd src/backend
npm test
```

- Frontend-Build:

```bash
cd src/frontend/app
npm run build
```

## Bekannte MVP-Grenzen
- Bilder werden aktuell clientseitig als komprimierte Data-URLs gespeichert; es gibt noch keinen serverseitigen Datei-Upload oder externen Storage.
- Chat ist anfragebasiert, nicht in Echtzeit per WebSocket.
- Nutzerpositionen auf der Karte sind bewusst pseudoanonymisiert für die Demo.
- Nicht-Personen-Swipes sind aktuell als Entdeckungskontexte umgesetzt, aber noch ohne eigene persistente Empfehlungslogik oder Matchmechanik.

## Scrum-Dokumente
- [Scrum-Überblick](./docs/scrum/scrum-overview.md)
- [Teamaufbau](./docs/scrum/team-setup.md)
- [Projektziele](./docs/scrum/project-goals.md)
- [Produkt-Backlog](./docs/scrum/product-backlog.md)
- Sprint 1: [Planung](./docs/scrum/sprint-01-planning.md), [Review](./docs/scrum/sprint-01-review.md), [Retrospektive](./docs/scrum/sprint-01-retro.md), [Aufgabenboard](./docs/scrum/sprint-01-board.md)
- Sprint 2: [Planung](./docs/scrum/sprint-02-planning.md), [Review](./docs/scrum/sprint-02-review.md), [Retrospektive](./docs/scrum/sprint-02-retro.md), [Aufgabenboard](./docs/scrum/sprint-02-board.md)
- Sprint 3: [Planung](./docs/scrum/sprint-03-planning.md), [Review](./docs/scrum/sprint-03-review.md), [Retrospektive](./docs/scrum/sprint-03-retro.md), [Aufgabenboard](./docs/scrum/sprint-03-board.md)
- Sprint 4: [Planung](./docs/scrum/sprint-04-planning.md), [Review](./docs/scrum/sprint-04-review.md), [Retrospektive](./docs/scrum/sprint-04-retro.md), [Aufgabenboard](./docs/scrum/sprint-04-board.md)

## Weitere Dokumentation
- [Anforderungen](./docs/requirements/user-stories.md)
- [Personas](./docs/requirements/personas.md)
- [Architektur](./docs/architecture/architecture.md)
- [Benutzer- und Demo-Leitfaden](./docs/user-manual/user-guide.md)
