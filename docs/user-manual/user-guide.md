# PMA User Guide

## Zweck
- Dieser Leitfaden beschreibt die Nutzung des aktuellen MVP aus Anwendersicht.
- Er ist als kompakte Bedienhilfe fuer Demo, Review und Abgabe gedacht.

## Voraussetzungen
- Das Backend laeuft auf `http://localhost:5000`.
- Das Frontend laeuft auf `http://localhost:3000`.
- Demo-Daten wurden ueber `npm run seed:demo` eingespielt.

## Einstieg
1. Oeffne die Startseite im Browser.
2. Waehle `Login` oder `Signup`.
3. Fuer die Demo kann z. B. `neo / demo12345` verwendet werden.

## Profil bearbeiten
1. Wechsle in den Profilbereich.
2. Pflege Bio, Interessen, Sprachen und weitere Angaben.
3. Fuege Bilder zur Galerie hinzu.
4. Speichere das Profil.

## Discovery und Swipe
1. Oeffne `Swipe`.
2. Nutze die Deck-Auswahl, um zwischen Menschen, Hobbys, Events und Locations zu wechseln.
3. Wische oder klicke auf `Like` bzw. `Pass`.
4. Bei People-Swipes koennen gegenseitige Likes zu Matches fuehren.

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

## Bekannte Einschraenkungen
- Bilder werden aktuell als komprimierte Data-URLs verarbeitet.
- Chat aktualisiert sich request-basiert und nicht per Live-WebSocket.
- Nicht-Personen-Swipes sind Discovery-Kontexte, aber noch keine voll persistente Empfehlungslogik.
