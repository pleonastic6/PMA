# FRIENDS Architektur

## Ziel
- Diese Architekturübersicht beschreibt den aktuellen MVP-Stand von FRIENDS auf Systemebene.
- Der Fokus liegt auf einer nachvollziehbaren Hochschulprojekt-Architektur, nicht auf produktionsreifer Skalierung.

## Systemkontext
- FRIENDS ist eine Webanwendung für soziale Entdeckung.
- Nutzer verwenden ein React-Frontend im Browser.
- Das Frontend kommuniziert per HTTP mit einer Node.js-/Express-API.
- Die API speichert persistente Daten in MongoDB.
- Für Ortsvorschläge wird die externe Nominatim-/OSM-Suche angebunden.

## Bausteine
- Frontend:
  React Single-Page-App mit Routing für Home, Login, Profil, Swipe, Matches, Chat, Events und Karte.
- Backend:
  Express-Anwendung mit REST-API unter `/api/v1`.
- Datenhaltung:
  MongoDB mit Mongoose-Modellen für Nutzer, Sessions, Swipes, Messages und Events.
- Externe Dienste:
  Nominatim/OSM für Orts- und Stadtvorschläge.

## Fachliche Hauptmodule
- `auth`:
  Registrierung, Login, Session-Token und Zugriffsschutz.
- `users`:
  Profilpflege, öffentliche Profilansicht und präsentationstaugliche Nutzerdaten.
- `discovery`:
  Aufbau der Wischbereiche für Menschen, Hobbys, Events und Locations.
- `matches`:
  Like/Pass-Mechanik und Match-Erkennung.
- `chat`:
  Nachrichten zwischen bestehenden Matches.
- `events`:
  Event-Anlage, Bearbeitung, Listenansicht und Filter.
- `map`:
  Kartenansicht für Event-Positionen und anonymisierte Nutzerzonen.
- `places`:
  Ortsvorschläge über OSM.

## Architekturentscheidungen
- Monolithisches Backend statt Microservices:
  Für den MVP war ein klar strukturierter Monolith schneller umsetzbar und leichter testbar.
- REST statt WebSockets:
  Chat ist für den MVP anfragebasiert; Live-Kommunikation wurde bewusst vertagt.
- Data-URL-Bilder statt Dateispeicher:
  Das reduziert Infrastrukturaufwand, ist aber nur eine MVP-Zwischenlösung.
- Mehrere Wischbereiche im selben Produktfluss:
  Menschen bleiben Kernfluss, Hobbys, Events und Locations erweitern die Entdeckungsidee sichtbar.

## Datenfluss eines typischen Kernszenarios
1. Nutzer loggt sich ein und erhält ein Session-Token.
2. Das Frontend ruft `/api/v1/discovery` auf.
3. Das Backend liest Nutzer-, Swipe- und Eventdaten aus MongoDB.
4. Daraus werden Wischbereiche für Menschen, Hobbys, Events und Locations erzeugt.
5. Das Frontend zeigt die Wischbereiche in der Swipe-Oberfläche an.
6. Personenswipes werden über die Match-Logik persistiert und können später zu Chat führen.

## Diagramme und ADRs
- [Komponentendiagramm](./component-diagram.md)
- [Deployment-Diagramm](./deployment-diagram.md)
