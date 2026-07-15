# PMA

PMA ist ein Social-Matching-MVP mit Registrierung, Profilen, Personen-Discovery, Matches, Chat, Events und Kartenansicht.

## Stack
- Frontend: React + React Router + Tailwind + React Leaflet
- Backend: Node.js + Express + MongoDB + Mongoose
- Tests: `node --test` mit `mongodb-memory-server`

## MVP-Features
- Registrierung und Login mit Session-Token
- Profilpflege mit erweiterten Feldern, Galerie und Swipe-Praeferenzen
- Discovery-Feed mit Like/Pass
- Gegenseitige Likes erzeugen Matches
- Oeffentliche Profilansicht fuer andere Nutzer innerhalb der App
- Chat nur zwischen Matches
- Events erstellen, bearbeiten, loeschen und filtern
- Karte mit Event-Markern und anonymisierten Nutzerzonen
- Orts- und Stadtvorschlaege ueber Nominatim/OSM

## Projektstruktur
- `frontend/app` React-Frontend
- `backend` Express-API
- `docs/scrum` Scrum-Artefakte, Sprintdokumente und Projektziele
- `docs/requirements` User Stories und Personas
- `docs/architecture` Architekturuebersicht, Diagramme und ADR
- `docs/user-manual` kompakter Bedienleitfaden
- `docs/presentation` OTH-Beamer-Praesentation

## Quick Start

### 1. MongoDB starten
Beispiel lokal:

```bash
mongod --dbpath /tmp/pma-mongo
```

Oder eine bestehende MongoDB-Instanz verwenden.

### 2. Backend konfigurieren

```bash
cd backend
cp .env.example .env
npm install
```

Wichtige Variable in `.env`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/pma
```

### 3. Demo-Daten laden

```bash
npm run seed:demo
```

Das Script leert die relevanten Collections und legt Demo-User, Matches, Chats und Events neu an.

### 4. Backend starten

```bash
npm run dev
```

Das Backend laeuft dann standardmaessig auf `http://localhost:5000`.

### 5. Frontend starten

```bash
cd ../frontend/app
npm install
npm start
```

Das Frontend laeuft standardmaessig auf `http://localhost:3000`.

## Demo-Accounts
- `neo / demo12345`
- `trinity / demo12345`
- `morpheus / demo12345`
- `switch / demo12345`

## Empfohlener Demo-Ablauf
1. Mit `neo` einloggen.
2. Profil kurz zeigen, inklusive Galerie und Interessen/Sprachen.
3. `Swipe` oeffnen und die Karten mit Mehrfach-Slides erklaeren.
4. `Matches` oeffnen, vorhandene Matches zeigen und ein Profil aufrufen.
5. In `Chat` die Demo-Unterhaltung mit `trinity` zeigen.
6. In `Events` die vorhandenen Events samt Filtern zeigen.
7. Optional neues Event anlegen oder ein bestehendes bearbeiten.
8. In `Map` die Event-Marker und Nutzerzonen zeigen.

## Nützliche Commands

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
cd backend
npm test
```

- Frontend-Produktionsbuild:

```bash
cd frontend/app
npm run build
```

## Bekannte MVP-Grenzen
- Bilder werden aktuell clientseitig als komprimierte Data-URLs gespeichert; es gibt noch keinen serverseitigen Datei-Upload oder externen Storage.
- Chat ist Request-basiert, nicht in Echtzeit per WebSocket.
- Nutzerpositionen auf der Karte sind bewusst pseudoanonymisiert fuer die Demo.
- Nicht-Personen-Swipes sind aktuell als Discovery-Kontexte umgesetzt, aber noch ohne eigene persistente Empfehlungslogik oder Matchmechanik.

## Scrum-Dokumente
- [Scrum Overview](./docs/scrum/scrum-overview.md)
- [Team Setup](./docs/scrum/team-setup.md)
- [Projektziele](./docs/scrum/project-goals.md)
- [Product Backlog](./docs/scrum/product-backlog.md)
- Sprint 1: [Planning](./docs/scrum/sprint-01-planning.md), [Review](./docs/scrum/sprint-01-review.md), [Retro](./docs/scrum/sprint-01-retro.md), [Board](./docs/scrum/sprint-01-board.md)
- Sprint 2: [Planning](./docs/scrum/sprint-02-planning.md), [Review](./docs/scrum/sprint-02-review.md), [Retro](./docs/scrum/sprint-02-retro.md), [Board](./docs/scrum/sprint-02-board.md)
- Sprint 3: [Planning](./docs/scrum/sprint-03-planning.md), [Review](./docs/scrum/sprint-03-review.md), [Retro](./docs/scrum/sprint-03-retro.md), [Board](./docs/scrum/sprint-03-board.md)
- Sprint 4: [Planning](./docs/scrum/sprint-04-planning.md), [Review](./docs/scrum/sprint-04-review.md), [Retro](./docs/scrum/sprint-04-retro.md), [Board](./docs/scrum/sprint-04-board.md)

## Weitere Dokumentation
- [Requirements](./docs/requirements/user-stories.md)
- [Personas](./docs/requirements/personas.md)
- [Architektur](./docs/architecture/architecture.md)
- [User Guide](./docs/user-manual/user-guide.md)
