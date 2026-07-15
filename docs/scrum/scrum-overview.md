# FRIENDS Scrum-Überblick

## Zweck
- Diese Datei fasst die Scrum-Story von FRIENDS kompakt zusammen.
- Sie ist als schneller Gesprächsleitfaden für Review, Abgabe oder Präsentation gedacht.

## Teamaufbau
- Scrum-Team mit 10 Personen
- Rollen, Arbeitsmodus und Kapazität: [Teamaufbau](team-setup.md)
- Priorisiertes Gesamtbacklog: [Produkt-Backlog](product-backlog.md)
- User Stories und SMART-Ziele: [Projektziele](project-goals.md)

## Projektziel
- FRIENDS soll als lauffähiger MVP zeigen, dass soziales Kennenlernen nicht nur über reines Personen-Matching gedacht werden kann, sondern über einen zusammenhängenden Produktfluss aus Profil, Entdecken, Match, Chat, swipebaren Interessen, Events, Locations und Kartenbezug.
- Der Fokus der Umsetzung liegt auf einem technisch vorführbaren durchgängigen System, nicht auf vollständigem Produktionsumfang.

## Zielrahmen
- Die verdichtete User-Story-Sicht und die explizite SMART-Formulierung stehen in [project-goals.md](project-goals.md).
- Für die Präsentation reicht als Kurzfassung:
  FRIENDS soll in vier Sprints als vorführbarer MVP entstehen, der nicht nur Personen, sondern auch Hobbys, Events und Locations in den Produktfluss einbindet.

## Grobe Meilensteine
- M1: Produktbild und klickbarer Frontend-Rahmen sichtbar
- M2: Vertikaler Kernfluss mit Auth, Profil und Entdecken von Personen läuft
- M3: Match-Nutzung durch Chat sowie Event-/Map-Bereiche sind im Produkt erlebbar
- M4: Events und Karte sind an echte Backend-Daten angebunden, mehrere Wischbereiche sind vorführbar, Demo und Doku sind abgabefähig

## Produktidee
- FRIENDS ist keine reine Dating-App, sondern eine App für soziales Kennenlernen.
- Der aktuelle MVP-Stand hat Personen weiterhin als Kernfluss, öffnet das Entdecken aber zusätzlich über weitere swipebare Kontexte:
  - Hobbys
  - Events
  - Locations

## Entwicklungslogik
- Sprint 1 war noch deutlich frontend-lastig und eher als klickbarer Produktentwurf aufgebaut.
- Im Review wurde klar, dass dieser Ansatz für das Projekt zu oberflächlich ist und vertikaler gearbeitet werden muss.
- Ab Sprint 2 wurde der Fokus deshalb bewusst auf echte durchgängige Arbeitsabläufe gelegt: Frontend, Backend und Datenmodell sollten pro Inkrement gemeinsam wachsen.

## Sprint 1

### Fokus
- Produktidee sichtbar machen
- Projektsetup schaffen
- klickbaren Frontend-Prototyp aufbauen

### Ergebnis
- Landingpage und erste Matching-Idee im Frontend sichtbar
- klickbarer App-Rahmen für Profil- und Swipe-Idee vorhanden
- technisches Grundsetup begonnen, aber noch ohne echten vertikalen Produktfluss

### Wichtigste Rückmeldungen aus dem Review
- Der Stakeholder wollte, dass die Produktidee nicht auf reines Personen-Swipen verengt bleibt.
- Zusätzlich sollten Hobbys, Events und Locations sichtbar in das Gesamtprodukt einzahlen.
- Gleichzeitig wurde deutlich, dass ein reiner Frontend-/Prototyp-Sprint nicht reicht und die nächsten Sprints deutlich vertikaler zugeschnitten werden müssen.

## Sprint 2

### Fokus
- den reinen Frontend-Stand in einen echten Produktfluss überführen
- Personen- und Interessenebene funktional machen
- echte Authentifizierung, Profilpflege und Entdecken als erster vertikaler Kernfluss

### Ergebnis
- Registrierung und Login
- Profilbearbeitung
- Entdeckungsübersicht
- Wischmechanik
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
- fachliche Vorbereitung für spätere Wischbereiche jenseits von Personen

### Produktwirkung
- FRIENDS wirkte jetzt nicht mehr wie nur „Tinder für Personen“, sondern wie eine breiter gedachte App für soziales Kennenlernen.

## Sprint 4

### Fokus
- technische Schließung des MVP
- Demo-Fähigkeit
- Doku und Abgabevorbereitung

### Ergebnis
- Events über echtes Backend
- Kartenansicht mit API-Daten
- Wischbereiche für Hobbys, Events und Locations
- stabile Frontend-Flows
- Befüllung mit Demodaten
- README, Benutzerleitfaden und Scrum-Dokumente

## Endstand des MVP
- Registrierung / Login
- Profilpflege
- Profilgalerie und Profil-Detailansichten
- Entdecken von Personen
- Wischbereiche für Hobbys, Events und Locations
- Interessen/Hobbys und Sprachen als Profilbasis
- Swipe und Match
- Chat
- Events inkl. Suche/Filter und Bearbeitung
- Kartenansicht mit Event-/Location-Bezug

## Was bewusst offen blieb
- serverseitiger Bild-Upload mit echter Dateispeicherung
- Live-Chat per WebSocket
- Persistenz und eigene Empfehlungslogik für Nicht-Personen-Swipes

## Empfohlene Kurz-Erklärung in der Präsentation
- „Im ersten Sprint haben wir noch zu frontend-lastig gearbeitet und vor allem ein klickbares Produktbild gebaut. Durch das Feedback im Review haben wir dann umgestellt und ab Sprint 2 deutlich vertikaler gearbeitet: echte Authentifizierung, Profile, Entdeckungslogik, danach Chat, Events und Ortsbezug und am Ende Stabilisierung und Doku.“

## Zugehörige Detaildokumente
- Sprint 1: [Planung](sprint-01-planning.md), [Review](sprint-01-review.md), [Retrospektive](sprint-01-retro.md), [Aufgabenboard](sprint-01-board.md)
- Sprint 2: [Planung](sprint-02-planning.md), [Review](sprint-02-review.md), [Retrospektive](sprint-02-retro.md), [Aufgabenboard](sprint-02-board.md)
- Sprint 3: [Planung](sprint-03-planning.md), [Review](sprint-03-review.md), [Retrospektive](sprint-03-retro.md), [Aufgabenboard](sprint-03-board.md)
- Sprint 4: [Planung](sprint-04-planning.md), [Review](sprint-04-review.md), [Retrospektive](sprint-04-retro.md), [Aufgabenboard](sprint-04-board.md)
