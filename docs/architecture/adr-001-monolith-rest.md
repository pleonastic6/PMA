# ADR 001: Monolithische REST-Architektur fuer den MVP

## Status
- Accepted

## Kontext
- PMA sollte in vier Sprints als vorfuehrbarer MVP entstehen.
- Das Team musste Frontend, Backend, Datenmodell und Doku in engem Zeitrahmen liefern.

## Entscheidung
- Das System wird als getrenntes React-Frontend plus monolithisches Express-Backend umgesetzt.
- Die Kommunikation erfolgt ueber REST-Endpunkte.
- Persistente Daten werden in MongoDB gehalten.

## Begruendung
- Ein Monolith reduziert Integrationsaufwand und Projektkomplexitaet.
- REST ist fuer die geplanten Kernflows gut nachvollziehbar und schnell testbar.
- Die Architektur passt zum Hochschulprojekt und ermoeglicht saubere End-to-End-Demos.

## Konsequenzen
- Positiv:
  Einfache lokale Entwicklungsumgebung, geringe Infrastrukturkomplexitaet, klare API-Grenze.
- Negativ:
  Kein Live-Chat in Echtzeit und keine feingranulare technische Skalierung.
- Offen:
  WebSocket-Chat und echter Datei-Upload koennen spaeter als Ausbau folgen.
