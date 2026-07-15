# Sprint 2 Retrospektive

## Was gut lief
- Der FRIENDS-Kern wurde greifbar, weil Authentifizierung und Profile nicht mehr nur Prototypen waren.
- Swipe und Match-Logik gaben dem Projekt einen echten Produktcharakter.
- Die Trennung in Module für Auth, User und Matches machte das Backend übersichtlicher.
- Der Wechsel weg vom reinen Frontend-Fokus hat dem Projekt sichtbar mehr Glaubwürdigkeit gegeben.

## Was nicht gut lief
- Frontend-Flows mussten mehrfach angepasst werden, weil Session-Handling erst während der Umsetzung wirklich klar wurde.
- Einige Profilfelder wurden zunächst nur für die UI gebaut und später für das Backend nachgezogen.

## Erkenntnisse
- Geschützte Routen und die Wiederherstellung von Sitzungen sollten früh standardisiert werden.
- Die Entdeckungslogik braucht von Anfang an klare Regeln dafür, wen man sieht und wen nicht.
- Stakeholder-Feedback muss früh genug in Datenmodell und Story-Schnitt einfließen, nicht erst nach Oberflächen-Nacharbeit.
- Vertikaler Fortschritt ist im Review deutlich besser vermittelbar als viele lose Bildschirmansichten.

## Maßnahmen für Sprint 3
- Chat als nächsten logischen Schritt direkt an Matches koppeln.
- Events und Kartenansicht nicht mehr als isolierte Prototyp-Komponenten behandeln.
- Erweiterungen für die Entdeckungslogik früh technisch vorbereiten, auch wenn sie noch nicht vollständig ausgebaut werden.
