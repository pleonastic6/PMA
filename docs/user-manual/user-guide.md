# PMA Benutzer- und Demo-Leitfaden

## Zweck
- Dieser Leitfaden beschreibt die Inbetriebnahme und Nutzung des aktuellen MVP.
- Er dient gleichzeitig als Bedienhilfe fuer Demo, Review und Abgabe.

## Projekt vorbereiten

### 1. MongoDB-Datenordner anlegen
Lege im Projektverzeichnis den Ordner `data/mongodb` an. In diesem Ordner speichert MongoDB die lokale Datenbank fuer PMA.

```bash
mkdir -p data/mongodb
```

### 2. MongoDB starten
Starte MongoDB aus dem Projektverzeichnis mit dem eben angelegten Datenordner.

```bash
mongod --dbpath ./data/mongodb
```

Hinweise:
- Das Terminal mit `mongod` muss waehrend der Nutzung offen bleiben.
- Falls Port `27017` bereits belegt ist, laeuft meist schon eine andere MongoDB-Instanz.
- Wird eine eigene MongoDB-Instanz verwendet, muss die Verbindungsadresse spaeter in der `.env` dazu passen.

### 3. Backend einrichten
Wechsle in das Backend, installiere die Abhaengigkeiten und lege die lokale Konfigurationsdatei an.

```bash
cd src/backend
npm install
cp .env.example .env
```

Wichtige Variable in `.env`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/pma
```

### 4. Demo-Daten einspielen
Das Seed-Skript legt Demo-Nutzer, Matches, Chats und Events an.

```bash
npm run seed:demo
```

### 5. Backend starten

```bash
npm run dev
```

Das Backend laeuft danach standardmaessig unter `http://localhost:5000`.

### 6. Frontend starten
Oeffne ein zweites Terminal und starte das Frontend.

```bash
cd src/frontend/app
npm install
npm start
```

Das Frontend laeuft danach standardmaessig unter `http://localhost:3000`.

## Voraussetzungen fuer die Nutzung
- MongoDB laeuft lokal oder ueber eine passend konfigurierte Instanz.
- Das Backend laeuft auf `http://localhost:5000`.
- Das Frontend laeuft auf `http://localhost:3000`.
- Die Demo-Daten wurden ueber `npm run seed:demo` eingespielt.

## Demo-Zugaenge
- `neo / demo12345`
- `trinity / demo12345`
- `morpheus / demo12345`
- `switch / demo12345`

## Einstieg
1. Oeffne die Startseite im Browser.
2. Waehle `Login` oder `Registrierung`.
3. Fuer die Demo kann zum Beispiel `neo / demo12345` verwendet werden.

## Empfohlener Demo-Ablauf
1. Mit `neo` einloggen.
2. Das Profil mit Galerie, Interessen, Sprachen und Swipe-Praeferenzen zeigen.
3. `Swipe` oeffnen und zwischen Menschen, Hobbys, Events und Locations wechseln.
4. Bei einem Personenprofil durch die Mehrfach-Slides klicken und `Like` oder `Pass` erklaeren.
5. `Matches` oeffnen, ein bestehendes Match auswaehlen und den Chatverlauf zeigen.
6. `Events` oeffnen, vorhandene Demo-Events mit Suche oder Filtern zeigen und bei Bedarf ein Event bearbeiten oder neu anlegen.
7. `Map` oeffnen und Event-Marker sowie Nutzerzonen erklaeren.

## Profil bearbeiten
1. Wechsle in den Profilbereich.
2. Pflege Bio, Interessen, Sprachen und weitere Angaben.
3. Fuege Bilder zur Galerie hinzu.
4. Speichere das Profil.

## Entdecken und Swipen
1. Oeffne `Swipe`.
2. Nutze die Bereichsauswahl, um zwischen Menschen, Hobbys, Events und Locations zu wechseln.
3. Wische oder klicke auf `Like` beziehungsweise `Pass`.
4. Bei Personen-Swipes koennen gegenseitige Likes zu Matches fuehren.

## Matches und Chat
1. Oeffne `Matches`.
2. Waehle ein bestehendes Match.
3. Starte oder lies eine Unterhaltung im Chatbereich.

## Events
1. Oeffne `Events`.
2. Filtere vorhandene Demo-Events oder lege ein neues Event an.
3. Bestehende eigene Events koennen bearbeitet werden.

## Karte
1. Oeffne `Map`.
2. Betrachte Event-Marker und anonymisierte Nutzerzonen.
3. Nutze die Karte, um Ortsbezuege besser einzuordnen.

## Falls bei der Demo etwas schiefgeht
- `npm run seed:demo` im Backend erneut ausfuehren
- die Seite im Browser neu laden
- pruefen, ob das Backend auf Port `5000` laeuft
- pruefen, ob `mongod` noch aktiv ist und `data/mongodb` als Datenordner verwendet

## Bekannte Einschraenkungen
- Bilder werden aktuell als komprimierte Data-URLs verarbeitet.
- Chat aktualisiert sich anfragebasiert und nicht in Echtzeit per WebSocket.
- Nicht-Personen-Swipes sind Entdeckungskontexte, aber noch keine voll persistente Empfehlungslogik.
