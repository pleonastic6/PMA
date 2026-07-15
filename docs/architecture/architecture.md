# PMA Architektur

## Ziel
- Diese Architekturuebersicht beschreibt den aktuellen MVP-Stand von PMA auf Systemebene.
- Der Fokus liegt auf einer nachvollziehbaren Hochschulprojekt-Architektur, nicht auf produktionsreifer Skalierung.

## Systemkontext
- PMA ist eine Webanwendung fuer Social Discovery.
- Nutzer verwenden ein React-Frontend im Browser.
- Das Frontend kommuniziert per HTTP mit einer Node.js-/Express-API.
- Die API speichert persistente Daten in MongoDB.
- Fuer Ortsvorschlaege wird die externe Nominatim-/OSM-Suche angebunden.

## Bausteine
- Frontend:
  React Single-Page-App mit Routing fuer Home, Login, Profil, Swipe, Matches, Chat, Events und Karte.
- Backend:
  Express-Anwendung mit REST-API unter `/api/v1`.
- Datenhaltung:
  MongoDB mit Mongoose-Modellen fuer Nutzer, Sessions, Swipes, Messages und Events.
- Externe Dienste:
  Nominatim/OSM fuer Orts- und Stadtvorschlaege.

## Fachliche Hauptmodule
- `auth`:
  Registrierung, Login, Session-Token und Zugriffsschutz.
- `users`:
  Profilpflege, oeffentliche Profilansicht und praesentationstaugliche Nutzerdaten.
- `discovery`:
  Aufbau der Swipe-Decks fuer Menschen, Hobbys, Events und Locations.
- `matches`:
  Like/Pass-Mechanik und Match-Erkennung.
- `chat`:
  Nachrichten zwischen bestehenden Matches.
- `events`:
  Event-Anlage, Bearbeitung, Listenansicht und Filter.
- `map`:
  Kartenansicht fuer Event-Positionen und anonymisierte Nutzerzonen.
- `places`:
  Ortsvorschlaege ueber OSM.

## Architekturentscheidungen
- Monolithisches Backend statt Microservices:
  Fuer den MVP war ein klar strukturierter Monolith schneller umsetzbar und leichter testbar.
- REST statt WebSockets:
  Chat ist fuer den MVP request-basiert; Live-Kommunikation wurde bewusst vertagt.
- Data-URL-Bilder statt Dateispeicher:
  Das reduziert Infrastrukturaufwand, ist aber nur eine MVP-Zwischenloesung.
- Multi-Deck-Discovery im selben Produktfluss:
  Menschen bleiben Kernflow, Hobbys, Events und Locations erweitern die Discovery-Idee sichtbar.

## Datenfluss eines typischen Kernszenarios
1. Nutzer loggt sich ein und erhaelt ein Session-Token.
2. Das Frontend ruft `/api/v1/discovery` auf.
3. Das Backend liest Nutzer-, Swipe- und Eventdaten aus MongoDB.
4. Daraus werden People-, Interest-, Event- und Location-Decks erzeugt.
5. Das Frontend zeigt die Decks in der Swipe-Oberflaeche an.
6. Personenswipes werden ueber die Match-Logik persistiert und koennen spaeter zu Chat fuehren.

## Diagramme und ADRs
- [Komponentendiagramm](./component-diagram.md)
- [Deployment-Diagramm](./deployment-diagram.md)
- [ADR 001 - Monolithische REST-Architektur](./adr-001-monolith-rest.md)
