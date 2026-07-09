# Sprint 3 Retrospektive

## Status
- Dokument ist bewusst als simuliertes Scrum-Artefakt fuer das PMA-Hochschulprojekt formuliert.

## What went well
- Die Aufteilung in Backend-Module fuer Auth, Matches, Chat und Events hat die Umsetzung beschleunigt.
- Durch die fruehen Backend-Tests liessen sich Regressionen schnell erkennen.
- Chat als Feature hat den Mehrwert von Matches sofort sichtbar gemacht.
- Das Team hat den Scope auf einen realistischen Demo-MVP begrenzt statt zu viel Social-Feature-Kram anzufangen.

## What did not go well
- Frontend und Backend waren zeitweise asynchron im Stand; dadurch blieben Events und Karte zunaechst auf Mockdaten.
- Request-Logik im Frontend war anfangs nicht sauber stabilisiert und haette mehrfaches Nachladen verursachen koennen.
- Einige UI-Texte und Altlasten aus fruehen Mockups mussten spaet bereinigt werden.

## Learnings
- Sobald ein Backend existiert, sollten lokale Service-Mocks konsequent entfernt werden.
- Geschuetzte Routen und Session-Hydration muessen frueh definiert werden, sonst entstehen spaeter viele kleine Brueche.
- Ein kleines, aber gruenes Testset bringt fuer Studierendenprojekte mehr als ein grosser ungewarteter Testplan.

## Action Items fuer naechsten Sprint
- Events und Karte auf echte Backend-Daten umstellen.
- Demo-Daten und reproduzierbaren Präsentationsablauf vorbereiten.
- Build-/Test-Stabilitaet und Doku fuer die Abgabe nachziehen.
