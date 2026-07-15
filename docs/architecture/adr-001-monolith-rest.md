# ADR 001: Monolithische REST-Architektur für den MVP

## Status
- Accepted

## Kontext
- PMA sollte in vier Sprints als vorführbarer MVP entstehen.
- Das Team musste Frontend, Backend, Datenmodell und Doku in engem Zeitrahmen liefern.

## Entscheidung
- Das System wird als getrenntes React-Frontend plus monolithisches Express-Backend umgesetzt.
- Die Kommunikation erfolgt über REST-Endpunkte.
- Persistente Daten werden in MongoDB gehalten.

## Begründung
- Ein Monolith reduziert Integrationsaufwand und Projektkomplexität.
- REST ist für die geplanten Kernflows gut nachvollziehbar und schnell testbar.
- Die Architektur passt zum Hochschulprojekt und ermöglicht saubere End-to-End-Demos.

## Konsequenzen
- Positiv:
  Einfache lokale Entwicklungsumgebung, geringe Infrastrukturkomplexität, klare API-Grenze.
- Negativ:
  Kein Live-Chat in Echtzeit und keine feingranulare technische Skalierung.
- Offen:
  WebSocket-Chat und echter Datei-Upload können später als Ausbau folgen.
