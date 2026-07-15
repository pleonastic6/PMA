# PMA User Guide

## Zweck
- Dieser Leitfaden beschreibt die Nutzung des aktuellen MVP aus Anwendersicht.
- Er ist als kompakte Bedienhilfe für Demo, Review und Abgabe gedacht.

## Voraussetzungen
- Das Backend läuft auf `http://localhost:5000`.
- Das Frontend läuft auf `http://localhost:3000`.
- Demo-Daten wurden über `npm run seed:demo` eingespielt.

## Einstieg
1. Öffne die Startseite im Browser.
2. Wähle `Login` oder `Signup`.
3. Für die Demo kann z. B. `neo / demo12345` verwendet werden.

## Profil bearbeiten
1. Wechsle in den Profilbereich.
2. Pflege Bio, Interessen, Sprachen und weitere Angaben.
3. Füge Bilder zur Galerie hinzu.
4. Speichere das Profil.

## Discovery und Swipe
1. Öffne `Swipe`.
2. Nutze die Deck-Auswahl, um zwischen Menschen, Hobbys, Events und Locations zu wechseln.
3. Wische oder klicke auf `Like` bzw. `Pass`.
4. Bei People-Swipes können gegenseitige Likes zu Matches führen.

## Matches und Chat
1. Öffne `Matches`.
2. Wähle ein bestehendes Match.
3. Starte oder lies eine Unterhaltung im Chatbereich.

## Events
1. Öffne `Events`.
2. Filtere vorhandene Demo-Events oder lege ein neues Event an.
3. Bestehende eigene Events können bearbeitet werden.

## Karte
1. Öffne `Map`.
2. Betrachte Event-Marker und anonymisierte Nutzerzonen.
3. Nutze die Karte, um Ortsbezüge besser einzuordnen.

## Bekannte Einschränkungen
- Bilder werden aktuell als komprimierte Data-URLs verarbeitet.
- Chat aktualisiert sich request-basiert und nicht per Live-WebSocket.
- Nicht-Personen-Swipes sind Discovery-Kontexte, aber noch keine voll persistente Empfehlungslogik.
