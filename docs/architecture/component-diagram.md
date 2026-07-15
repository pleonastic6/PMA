# PMA Komponentendiagramm

```mermaid
flowchart LR
    U[Benutzer im Browser]
    FE[React Frontend]
    API[Express API /api/v1]
    AUTH[Auth Modul]
    USERS[Users Modul]
    DISC[Discovery Modul]
    MATCH[Matches Modul]
    CHAT[Chat Modul]
    EVENTS[Events Modul]
    MAP[Map Modul]
    PLACES[Places Modul]
    DB[(MongoDB)]
    OSM[Nominatim / OSM]

    U --> FE
    FE --> API
    API --> AUTH
    API --> USERS
    API --> DISC
    API --> MATCH
    API --> CHAT
    API --> EVENTS
    API --> MAP
    API --> PLACES

    AUTH --> DB
    USERS --> DB
    DISC --> DB
    MATCH --> DB
    CHAT --> DB
    EVENTS --> DB
    MAP --> DB
    PLACES --> OSM
```

## Lesart
- Das Frontend ist der einzige direkte Einstiegspunkt fuer Nutzer.
- Das Backend kapselt die Fachlogik in klar getrennten Modulen.
- MongoDB ist die zentrale Persistenz fuer den MVP.
- Extern angebunden ist nur die Ortssuche.
