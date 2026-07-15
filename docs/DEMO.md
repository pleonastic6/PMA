# PMA Demo Guide

## Vorbereitung
1. MongoDB starten.
2. `cd src/backend && npm install`
3. `cp .env.example .env`
4. `npm run seed:demo`
5. `npm run dev`
6. `cd ../frontend/app && npm install && npm start`

## Ziel der Demo
- Zeigen, dass PMA als MVP durchgängig funktioniert und nicht nur aus UI-Mockups besteht.

## Beste Reihenfolge
1. Login mit `neo / demo12345`
2. Profilseite mit Galerie, Interessen, Sprachen und Swipe-Präferenzen zeigen
3. Swipe/Discovery erklären und durch die Mehrfach-Slides eines Profils klicken
4. Matches anzeigen und ein Match-Profil öffnen
5. Chat mit vorhandenem Verlauf zeigen
6. Events-Übersicht inklusive Suche/Filter zeigen
7. Neues Event erstellen oder ein vorhandenes Event bearbeiten
8. Karte öffnen und Event-/Personenzonen zeigen

## Falls etwas live schiefgeht
- `npm run seed:demo` im Backend erneut ausführen
- Seite im Browser neu laden
- Sicherstellen, dass das Backend auf Port `5000` läuft

## Kurzargument für die Präsentation
- PMA kombiniert Social Discovery, Match-Logik, Chat und spontane Community-Events in einer App.
- Der Fokus des MVP liegt auf einem technisch durchgängigen End-to-End-Flow statt auf perfektem Produktionsumfang.

## Ehrlicher Hinweis bei Nachfragen
- Profilbilder funktionieren für den MVP bereits, aber noch ohne dedizierten Datei-Upload-Service oder Cloud-Storage.
- Chat ist bewusst noch polling-/request-basiert und nicht in Echtzeit umgesetzt.
