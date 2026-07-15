# Sprint 3 Retrospektive

## Status
- Dokument ist bewusst als simuliertes Scrum-Artefakt für das PMA-Hochschulprojekt formuliert.

## What went well
- Die Aufteilung in Backend-Module für Auth, Matches, Chat und Events hat die Umsetzung beschleunigt.
- Durch die frühen Backend-Tests liessen sich Regressionen schnell erkennen.
- Chat als Feature hat den Mehrwert von Matches sofort sichtbar gemacht.
- Das Team hat den Scope auf einen realistischen Demo-MVP begrenzt statt zu viel Social-Feature-Kram anzufangen.

## What did not go well
- Frontend und Backend waren zeitweise asynchron im Stand; dadurch blieben Events und Karte zunächst auf Mockdaten.
- Request-Logik im Frontend war anfangs nicht sauber stabilisiert und hätte mehrfaches Nachladen verursachen können.
- Einige UI-Texte und Altlasten aus frühen Mockups mussten spät bereinigt werden.

## Learnings
- Sobald ein Backend existiert, sollten lokale Service-Mocks konsequent entfernt werden.
- Geschützte Routen und Session-Hydration müssen früh definiert werden, sonst entstehen später viele kleine Brüche.
- Ein kleines, aber grünes Testset bringt für Studierendenprojekte mehr als ein grosser ungewarteter Testplan.

## Action Items für nächsten Sprint
- Events und Karte auf echte Backend-Daten umstellen.
- Demo-Daten und reproduzierbaren Präsentationsablauf vorbereiten.
- Build-/Test-Stabilität und Doku für die Abgabe nachziehen.
