# Sprint 2 Planning

## Status
- Dokument ist bewusst als simuliertes Scrum-Artefakt fuer das PMA-Hochschulprojekt formuliert.

## Sprint Goal
- Der bisherige Frontend-Prototyp soll in einen ersten echten vertikalen Produktfluss ueberfuehrt werden: Nutzerprofile mit Interessen/Hobbys, echte Authentifizierung und ein Discovery-Kern, der spaeter auch Events und Locations tragen kann.

## Team und Kapazitaet
- Beteiligte: gesamtes 10er Scrum-Team
- Geplante Kapazitaet: 42 SP brutto, davon 29 SP committed
- Schwerpunkte: Auth, Profil, Discovery, Match-Logik
- Zusatzannahme: bewusst vertikaler Zuschnitt nach dem Review-Feedback aus Sprint 1

## Geplante Inhalte
- Registrierung mit Session-Erzeugung
- Login mit Token-basierter Authentifizierung
- Profilansicht und Profilbearbeitung
- Discovery-Feed mit Kandidaten und Interessenbezug
- Swipe-Mechanik und Match-Erkennung

## Sprint Backlog
| ID | Story | Akzeptanzkriterium | Aufwand |
| --- | --- | --- | --- |
| PMA-11 | Als neuer Nutzer will ich mich registrieren | Nutzerkonto wird gespeichert und Session erzeugt | 5 SP |
| PMA-12 | Als Nutzer will ich mich einloggen | Login liefert Token und Nutzerdaten | 5 SP |
| PMA-13 | Als Nutzer will ich mein Profil bearbeiten | Profilfelder koennen gespeichert werden | 5 SP |
| PMA-14 | Als Nutzer will ich andere Profile samt Interessen sehen | Discovery liefert Kandidaten mit Hobbys/Interessen | 5 SP |
| PMA-15 | Als Nutzer will ich Likes und Passes vergeben | Swipes werden gespeichert | 3 SP |
| PMA-16 | Als Nutzer will ich Matches erkennen | Gegenseitige Likes erscheinen als Match | 3 SP |
| PMA-17 | Als Team wollen wir Interessen als Discovery-Basis modellieren | Profilfelder fuer Hobbys/Interessen sind fachlich nutzbar | 3 SP |

## Risiken
- Matching-Logik kann spaeter weitere Filter brauchen
- Token-/Session-Handling kann Frontend-Flows komplizierter machen als gedacht

## Board-Artefakt
- Board-Snapshot: [Sprint 2 Board](./sprint-02-board.md)

## Definition of Done
- Register/Login laufen gegen echtes Backend
- Profil kann geladen und gespeichert werden
- Discovery/Swipe/Match sind im MVP-Ende-zu-Ende testbar
- Interessen/Hobbys sind im Produktfluss sichtbar
