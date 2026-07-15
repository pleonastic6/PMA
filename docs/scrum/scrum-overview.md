# PMA Scrum Overview

## Zweck
- Diese Datei fasst die Scrum-Story von PMA kompakt zusammen.
- Sie ist als schneller Gesprächsleitfaden für Review, Abgabe oder Präsentation gedacht.

## Team-Setup
- Scrum-Team mit 10 Personen
- Rollen, Arbeitsmodus und Kapazitaet: [Team Setup](team-setup.md)
- Priorisiertes Gesamtbacklog: [Product Backlog](product-backlog.md)
- User Stories und SMART-Ziele: [Projektziele](project-goals.md)

## Projektziel
- PMA soll als lauffaehiger MVP zeigen, dass Social Discovery nicht nur ueber reines Personen-Matching gedacht werden kann, sondern ueber einen zusammenhaengenden Produktfluss aus Profil, Discovery, Match, Chat, swipebaren Interessen/Events/Locations und Kartenbezug.
- Der Fokus der Umsetzung liegt auf einem technisch vorfuehrbaren End-to-End-System, nicht auf vollstaendigem Produktionsumfang.

## Zielrahmen
- Die verdichtete User-Story-Sicht und die explizite SMART-Formulierung stehen in [project-goals.md](project-goals.md).
- Fuer die Praesentation reicht als Kurzfassung:
  PMA soll in vier Sprints als demo-faehiger Social-Discovery-MVP entstehen, der nicht nur Personen, sondern auch Hobbys, Events und Locations in den Produktfluss einbindet.

## Grobe Meilensteine
- M1: Produktbild und klickbarer Frontend-Rahmen sichtbar
- M2: Vertikaler Kernflow mit Auth, Profil und Personen-Discovery laeuft
- M3: Match-Nutzung durch Chat sowie Event-/Map-Bereiche sind im Produkt erlebbar
- M4: Events und Karte sind an echte Backend-Daten angebunden, mehrere Swipe-Decks sind vorfuehrbar, Demo und Doku sind abgabefaehig

## Produktidee
- PMA ist keine reine Dating-App, sondern eine Social-Discovery-App.
- Der aktuelle Live-MVP hat Personen weiterhin als Kernflow, oeffnet Discovery aber zusaetzlich ueber weitere swipebare Kontexte:
  - Hobbys
  - Events
  - Locations

## Entwicklungslogik
- Sprint 1 war noch deutlich frontend-lastig und eher als klickbarer Produktentwurf aufgebaut.
- Im Review wurde klar, dass dieser Ansatz fuer das Projekt zu oberflaechlich ist und vertikaler gearbeitet werden muss.
- Ab Sprint 2 wurde der Fokus deshalb bewusst auf echte End-to-End-Flows gelegt: Frontend, Backend und Datenmodell sollten pro Inkrement gemeinsam wachsen.

## Sprint 1

### Fokus
- Produktidee sichtbar machen
- Projektsetup schaffen
- klickbares Frontend-Mockup aufbauen

### Ergebnis
- Landingpage und erste Matching-Idee im Frontend sichtbar
- klickbarer App-Rahmen fuer Profil- und Swipe-Idee vorhanden
- technisches Grundsetup begonnen, aber noch ohne echten vertikalen Produktfluss

### Wichtigstes Review-Feedback
- Der Stakeholder wollte, dass die Produktidee nicht auf reines Personen-Swipen verengt bleibt.
- Zusaetzlich sollten Hobbys, Events und Locations sichtbar in das Gesamtprodukt einzahlen.
- Gleichzeitig wurde deutlich, dass ein reiner Frontend-/Mockup-Sprint nicht reicht und die naechsten Sprints deutlich vertikaler zugeschnitten werden muessen.

## Sprint 2

### Fokus
- den reinen Frontend-Stand in einen echten Produktfluss ueberfuehren
- Personen- und Interessenebene funktional machen
- echte Authentifizierung, Profilpflege und Discovery als erster vertikaler Kernflow

### Ergebnis
- Registrierung und Login
- Profilbearbeitung
- Discovery-Feed
- Swipe-Mechanik
- Match-Erkennung
- Hobbys/Interessen als sichtbarer Teil des Produkts

## Sprint 3

### Fokus
- Matches nutzbar machen
- horizontale Erweiterung um Interaktion und soziale Kontexte

### Ergebnis
- Matchliste
- Chat zwischen Matches
- Eventseiten im Frontend
- erste Kartenintegration
- fachliche Vorbereitung fuer spaetere Swipe-Decks jenseits von Personen

### Produktwirkung
- PMA wirkte jetzt nicht mehr wie nur „Tinder fuer Personen“, sondern wie eine breiter gedachte Social-App.

## Sprint 4

### Fokus
- technische Schließung des MVP
- Demo-Fähigkeit
- Doku und Abgabevorbereitung

### Ergebnis
- Events über echtes Backend
- Kartenansicht mit API-Daten
- Swipe-Decks fuer Hobbys, Events und Locations
- stabile Frontend-Flows
- Demo-Seeding
- README, Demo-Guide und Scrum-Dokumente

## Endstand des MVP
- Registrierung / Login
- Profilpflege
- Profilgalerie und Profil-Detailansichten
- Personen-Discovery
- Swipe-Decks fuer Hobbys, Events und Locations
- Interessen/Hobbys und Sprachen als Profilbasis
- Swipe und Match
- Chat
- Events inkl. Suche/Filter und Bearbeitung
- Kartenansicht mit Event-/Location-Bezug

## Was bewusst offen blieb
- serverseitiger Bild-Upload mit echter Dateispeicherung
- Live-Chat per WebSocket
- Persistenz und eigene Empfehlungslogik fuer Nicht-Personen-Swipes

## Empfohlene Kurz-Erklärung in der Präsentation
- „Im ersten Sprint haben wir noch zu frontend-lastig gearbeitet und vor allem ein klickbares Produktbild gebaut. Durch das Feedback im Review haben wir dann umgestellt und ab Sprint 2 deutlich vertikaler gearbeitet: echte Auth, Profile, Discovery, danach Chat, Events und Ortsbezug und am Ende Stabilisierung und Doku.“

## Zugehörige Detaildokumente
- Sprint 1: [Planning](sprint-01-planning.md), [Review](sprint-01-review.md), [Retro](sprint-01-retro.md), [Board-Snapshots](sprint-01-board.md)
- Sprint 2: [Planning](sprint-02-planning.md), [Review](sprint-02-review.md), [Retro](sprint-02-retro.md), [Board-Snapshots](sprint-01-board.md)
- Sprint 3: [Planning](sprint-03-planning.md), [Review](sprint-03-review.md), [Retro](sprint-03-retro.md), [Board-Snapshots](sprint-01-board.md)
- Sprint 4: [Planning](sprint-04-planning.md), [Review](sprint-04-review.md), [Retro](sprint-04-retro.md), [Board-Snapshots](sprint-01-board.md)

