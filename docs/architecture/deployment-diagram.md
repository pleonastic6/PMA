# PMA Deployment-Diagramm

```mermaid
flowchart TB
    Browser[Client-Browser]
    Frontend[React App auf localhost:3000]
    Backend[Node.js / Express auf localhost:5000]
    Mongo[(MongoDB Instanz)]
    OSM[Nominatim / OSM API]

    Browser --> Frontend
    Frontend --> Backend
    Backend --> Mongo
    Backend --> OSM
```

## Lesart
- Frontend und Backend laufen im Entwicklungsbetrieb getrennt.
- Die Browser-App spricht nur mit dem Backend.
- Das Backend uebernimmt Persistenz und externe Ortsabfragen.
