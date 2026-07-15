# Sprint 3 Planning

## Status
- Dokumentiert die Planung des dritten Sprints im PMA-Hochschulprojekt.

## Sprint Goal
- Der Personen-Discovery-Kern soll um echten sozialen Nutzen erweitert werden: Matches sollen in Chat übergehen, und Event-/Kartenbereiche sollen als nächste Produktdimension sichtbar werden.

## Team und Kapazität
- Beteiligte: 9 aktive Teammitglieder plus Scrum Master und Product Owner in Zeremonien
- Geplante Kapazität: 38 SP brutto, davon 20 SP committed
- Schwerpunkt: Match-Nutzung, Chat, Event-Vorarbeit, Map-Konzept

## Sprint Scope
- Chat zwischen Matches im Backend und Frontend implementieren.
- Matchliste nutzbar machen und Einstieg in Chat erlauben.
- Eventseiten im Frontend ausbauen.
- Kartenansicht fachlich vorbereiten.
- Vorarbeit für spätere Backend-Anbindung von Events und Map leisten.

## Sprint Backlog
| ID | Story | Akzeptanzkriterium | Aufwand |
| --- | --- | --- | --- |
| PMA-33 | Als Match will ich chatten können | Nachrichten können nur zwischen Matches gesendet und geladen werden | 5 SP |
| PMA-34 | Als Nutzer will ich meine Matches sehen | Matchliste zeigt gegenseitige Likes | 3 SP |
| PMA-35 | Als Nutzer will ich Events im UI sehen | Eventseiten und Eventformular sind vorbereitet | 3 SP |
| PMA-36 | Als Nutzer will ich eine Kartenansicht als Konzept sehen | Map-Komponente kann Events/Orte grundsätzlich darstellen | 3 SP |
| PMA-37 | Als Team wollen wir bestehende Kernflows stabil halten | Register/Login/Swipe/Match bleiben trotz neuer Features vorführbar | 3 SP |
| PMA-38 | Als Team wollen wir Event- und Kartenbereiche fachlich einrahmen | Nutzerfluss und Datenbedarf für Sprint 4 sind sichtbar vorbereitet | 3 SP |

## Definition of Done
- Chat und Matches laufen über echtes Backend.
- Event- und Kartenbereich sind im Frontend sichtbar.
- Kernflows Register -> Swipe -> Match -> Chat sind vorführbar.

## Risiken
- Events und Karte könnten zunächst noch auf Mockdaten beruhen.
- Kein Echtzeit-Chat; Request-basierter MVP muss reichen.

## Board-Artefakt
- Board-Snapshot: [Sprint 3 Board](./sprint-03-board.md)
