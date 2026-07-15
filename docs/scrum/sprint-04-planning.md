# Sprint 4 Planning

## Status
- Dokumentiert die Planung des vierten Sprints im PMA-Hochschulprojekt.

## Sprint Goal
- Das horizontal gedachte PMA-MVP soll technisch geschlossen, demo-faehig und fuer die Abgabe sauber dokumentiert werden.

## Team und Kapazitaet
- Beteiligte: gesamtes 10er Scrum-Team
- Geplante Kapazitaet: 36 SP brutto, davon 22 SP committed
- Schwerpunkt: Integration, Stabilisierung, Demo, Doku

## Geplante Inhalte
- Events ueber echtes Backend persistieren
- Kartenansicht auf API-Daten umstellen
- Swipe-Bereich um Hobbys, Events und Locations erweitern
- Frontend-Stabilisierung und Request-Flows bereinigen
- Tests und Build absichern
- Demo-Seeding und Projektdokumentation vorbereiten

## Sprint Backlog
| ID | Story | Akzeptanzkriterium | Aufwand |
| --- | --- | --- | --- |
| PMA-41 | Als Nutzer will ich Events persistent speichern | Events bleiben nach Reload erhalten | 5 SP |
| PMA-42 | Als Nutzer will ich Karte mit echten Daten sehen | Map laedt Events und Nutzerzonen ueber API | 5 SP |
| PMA-43 | Als Team wollen wir stabile Frontend-Flows | Keine offensichtlichen Lade-/Routing-Brueche | 3 SP |
| PMA-44 | Als Team wollen wir Demo-Daten auf Knopfdruck | Seed-Script erzeugt reproduzierbare Demo-Welt | 3 SP |
| PMA-45 | Als Team wollen wir eine saubere Abgabe | README, Demo-Guide und Scrum-Artefakte sind vorhanden | 3 SP |
| PMA-46 | Als Team wollen wir technische Verifikation | Backend-Tests und Frontend-Build laufen erfolgreich | 3 SP |
| PMA-55 | Als Nutzer will ich nicht nur Personen, sondern auch Hobbys, Events und Locations swipen koennen | Swipe-Ansicht bietet mehrere Discovery-Decks mit Demo-/Bestandsdaten | 3 SP |

## Risiken
- Letzte Integrationsfehler zwischen Frontend und Backend
- Dokumentation wird oft am Ende unterschätzt und kostet mehr Zeit als gedacht

## Board-Artefakt
- Board-Snapshot: [Sprint 4 Board](./sprint-04-board.md)

## Definition of Done
- Events und Map laufen ueber Backend
- Swipe-Ansicht zeigt mehrere Discovery-Kontexte
- Seed-Script ist nutzbar
- README und Demo-Doku sind aktuell
- Tests/Build laufen grün
