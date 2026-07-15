# Sprint 2 Planung

## Sprintziel
- Der bisherige Frontend-Prototyp soll in einen ersten echten vertikalen Produktfluss überführt werden: Nutzerprofile mit Interessen und Hobbys, echte Authentifizierung und ein Entdeckungskern, der später auch Events und Locations tragen kann.

## Team und Kapazität
- Beteiligte: gesamtes 10er Scrum-Team
- Geplante Kapazität: 42 SP brutto, davon 29 SP committed
- Schwerpunkte: Authentifizierung, Profil, Entdeckungslogik, Match-Logik
- Zusatzannahme: bewusst vertikaler Zuschnitt nach den Rückmeldungen aus dem Review von Sprint 1

## Geplante Inhalte
- Registrierung mit Session-Erzeugung
- Login mit Token-basierter Authentifizierung
- Profilansicht und Profilbearbeitung
- Entdeckungsübersicht mit Kandidaten und Interessenbezug
- Wischmechanik und Match-Erkennung

## Sprint Backlog
| ID | Story | Akzeptanzkriterium | Aufwand |
| --- | --- | --- | --- |
| FRIENDS-11 | Als neuer Nutzer will ich mich registrieren | Nutzerkonto wird gespeichert und Session erzeugt | 5 SP |
| FRIENDS-12 | Als Nutzer will ich mich einloggen | Login liefert Token und Nutzerdaten | 5 SP |
| FRIENDS-13 | Als Nutzer will ich mein Profil bearbeiten | Profilfelder können gespeichert werden | 5 SP |
| FRIENDS-14 | Als Nutzer will ich andere Profile samt Interessen sehen | Die Entdeckungsansicht liefert Kandidaten mit Hobbys und Interessen | 5 SP |
| FRIENDS-15 | Als Nutzer will ich Likes und Passes vergeben | Swipes werden gespeichert | 3 SP |
| FRIENDS-16 | Als Nutzer will ich Matches erkennen | Gegenseitige Likes erscheinen als Match | 3 SP |
| FRIENDS-17 | Als Team wollen wir Interessen als Grundlage der Entdeckungslogik modellieren | Profilfelder für Hobbys und Interessen sind fachlich nutzbar | 3 SP |

## Risiken
- Matching-Logik kann später weitere Filter brauchen
- Token-/Session-Handling kann Frontend-Flows komplizierter machen als gedacht

## Board-Verweis
- Aufgabenboard: [Sprint 2 Aufgabenboard](./sprint-02-board.md)

## Erledigungskriterien
- Register/Login laufen gegen echtes Backend
- Profil kann geladen und gespeichert werden
- Entdecken, Swipen und Matchen sind im MVP durchgängig testbar
- Interessen/Hobbys sind im Produktfluss sichtbar
