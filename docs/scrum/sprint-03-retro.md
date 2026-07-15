# Sprint 3 Retrospektive

## Was gut lief
- Die Aufteilung in Backend-Module für Auth, Matches, Chat und Events hat die Umsetzung beschleunigt.
- Durch die frühen Backend-Tests ließen sich Regressionen schnell erkennen.
- Chat als Feature hat den Mehrwert von Matches sofort sichtbar gemacht.
- Das Team hat den Umfang auf einen realistischen Demo-MVP begrenzt, statt zu viele zusätzliche Sozialfunktionen anzufangen.

## Was nicht gut lief
- Frontend und Backend waren zeitweise asynchron im Stand; dadurch blieben Events und Karte zunächst auf Platzhalterdaten.
- Anfragelogik im Frontend war anfangs nicht sauber stabilisiert und hätte mehrfaches Nachladen verursachen können.
- Einige Oberflächentexte und Altlasten aus frühen Prototypen mussten spät bereinigt werden.

## Erkenntnisse
- Sobald ein Backend existiert, sollten lokale Service-Mocks konsequent entfernt werden.
- Geschützte Routen und Session-Hydration müssen früh definiert werden, sonst entstehen später viele kleine Brüche.
- Ein kleines, aber grünes Testset bringt für Studierendenprojekte mehr als ein großer ungewarteter Testplan.

## Maßnahmen für den nächsten Sprint
- Events und Karte auf echte Backend-Daten umstellen.
- Demodaten und einen reproduzierbaren Präsentationsablauf vorbereiten.
- Build-, Teststabilität und Doku für die Abgabe nachziehen.
