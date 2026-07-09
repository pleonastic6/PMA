# Sprint 3 Planning

## Status
- Dokument ist bewusst als simuliertes Scrum-Artefakt fuer das PMA-Hochschulprojekt formuliert.

## Sprint Goal
- Das horizontale Discovery-Modell soll weiter wachsen: Nach Personen und Interessen kommen soziale Interaktion, Events und Ortsbezug als erlebbare Produktteile hinzu.

## Sprint Scope
- Chat zwischen Matches im Backend und Frontend implementieren.
- Matchliste nutzbar machen und Einstieg in Chat erlauben.
- Eventseiten im Frontend ausbauen.
- Kartenansicht fachlich vorbereiten.
- Vorarbeit fuer spaetere Backend-Anbindung von Events und Map leisten.

## Sprint Backlog
| ID | Story | Akzeptanzkriterium | Aufwand |
| --- | --- | --- | --- |
| PMA-31 | Als neuer Nutzer will ich mich registrieren und direkt ein Profil besitzen | Registrierung erzeugt Session und Profil ist aufrufbar | 5 SP |
| PMA-32 | Als Nutzer will ich andere Profile swipen koennen | Likes/Passes werden gespeichert und Matches entstehen bei Gegenseitigkeit | 5 SP |
| PMA-33 | Als Match will ich chatten koennen | Nachrichten koennen nur zwischen Matches gesendet und geladen werden | 5 SP |
| PMA-34 | Als Nutzer will ich meine Matches sehen | Matchliste zeigt gegenseitige Likes | 3 SP |
| PMA-35 | Als Nutzer will ich Events im UI sehen | Eventseiten und Eventformular sind vorbereitet | 3 SP |
| PMA-36 | Als Nutzer will ich eine Kartenansicht als Konzept sehen | Map-Komponente kann Events/Orte grundsaetzlich darstellen | 3 SP |

## Definition of Done
- Chat und Matches laufen ueber echtes Backend.
- Event- und Kartenbereich sind im Frontend sichtbar.
- Kernflows Register -> Swipe -> Match -> Chat sind vorfuehrbar.

## Risiken
- Events und Karte koennten zunaechst noch auf Mockdaten beruhen.
- Kein Echtzeit-Chat; Request-basierter MVP muss reichen.
