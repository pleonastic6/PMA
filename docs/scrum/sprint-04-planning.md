# Sprint 4 Planung

## Sprintziel
- Das horizontal gedachte FRIENDS-MVP soll technisch geschlossen, demo-fähig und für die Abgabe sauber dokumentiert werden.

## Team und Kapazität
- Beteiligte: gesamtes 10er Scrum-Team
- Geplante Kapazität: 36 SP brutto, davon 25 SP committed
- Schwerpunkt: Integration, Stabilisierung, Demo, Doku

## Geplante Inhalte
- Events über echtes Backend persistieren
- Kartenansicht auf API-Daten umstellen
- Swipe-Bereich um Hobbys, Events und Locations erweitern
- Frontend-Stabilisierung und Anfrageabläufe bereinigen
- Tests und Build absichern
- Befüllung mit Demodaten und Projektdokumentation vorbereiten

## Sprint Backlog
| ID | Story | Akzeptanzkriterium | Aufwand |
| --- | --- | --- | --- |
| FRIENDS-41 | Als Nutzer will ich Events persistent speichern | Events bleiben nach Reload erhalten | 5 SP |
| FRIENDS-42 | Als Nutzer will ich Karte mit echten Daten sehen | Map lädt Events und Nutzerzonen über API | 5 SP |
| FRIENDS-43 | Als Team wollen wir stabile Frontend-Flows | Keine offensichtlichen Lade-/Routing-Brüche | 3 SP |
| FRIENDS-44 | Als Team wollen wir Demo-Daten auf Knopfdruck | Skript für Demodaten erzeugt reproduzierbare Demo-Welt | 3 SP |
| FRIENDS-45 | Als Team wollen wir eine saubere Abgabe | README, Benutzerleitfaden und Scrum-Artefakte sind vorhanden | 3 SP |
| FRIENDS-46 | Als Team wollen wir technische Verifikation | Backend-Tests und Frontend-Build laufen erfolgreich | 3 SP |
| FRIENDS-55 | Als Nutzer will ich nicht nur Personen, sondern auch Hobbys, Events und Locations swipen können | Die Swipe-Ansicht bietet mehrere Wischbereiche mit Demo- und Bestandsdaten | 3 SP |

## Risiken
- Letzte Integrationsfehler zwischen Frontend und Backend
- Dokumentation wird oft am Ende unterschätzt und kostet mehr Zeit als gedacht

## Board-Verweis
- Aufgabenboard: [Sprint 4 Aufgabenboard](./sprint-04-board.md)

## Erledigungskriterien
- Events und Map laufen über Backend
- Die Swipe-Ansicht zeigt mehrere Wischkontexte
- Skript für Demodaten ist nutzbar
- README und Demo-Doku sind aktuell
- Tests und Build laufen grün
