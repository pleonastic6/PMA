# PMA Demo Guide

## Vorbereitung
1. MongoDB starten.
2. `cd backend && npm install`
3. `cp .env.example .env`
4. `npm run seed:demo`
5. `npm run dev`
6. `cd ../frontend/app && npm install && npm start`

## Ziel der Demo
- Zeigen, dass PMA als MVP durchgaengig funktioniert und nicht nur aus UI-Mockups besteht.

## Beste Reihenfolge
1. Login mit `neo / demo12345`
2. Profilseite kurz zeigen
3. Swipe/Discovery erklaeren
4. Matches anzeigen
5. Chat mit vorhandenem Verlauf zeigen
6. Events-Uebersicht zeigen
7. Neues Event erstellen
8. Karte oeffnen und Event/Personenzonen zeigen

## Falls etwas live schiefgeht
- `npm run seed:demo` im Backend erneut ausfuehren
- Seite im Browser neu laden
- Sicherstellen, dass das Backend auf Port `5000` laeuft

## Kurzargument fuer die Praesentation
- PMA kombiniert Social Discovery, Match-Logik, Chat und spontane Community-Events in einer App.
- Der Fokus des MVP liegt auf dem technisch durchgaengigen Flow statt auf perfektem Produktionsumfang.
