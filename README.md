# Test Hauptstadt-Verwaltung

## Überblick
Diese Anwendung ermöglicht das Verwalten von Hauptstädten mit einer interaktiven Karte und einer API. Hauptstädte können hinzugefügt, bearbeitet und gelöscht werden. Beim Start werden Daten von [restcountries.com](https://restcountries.com/v3.1/all) importiert.

## Technologien
- **Backend:** Node.js, Express, PostgreSQL
- **Frontend:** React, TypeScript, Zustand, MapBox

## Installation
### Voraussetzungen
- Node.js (>= 16)
- PostgreSQL (brew install postgresql@14 && brew services start postgresql)
- npm oder yarn

### Backend
```bash
cd capital-app/backend
npm install
npm run createdb # Erstellt die DB
npm run migrate  # Erstellt das DB-Schema
npm run dev      # Startet den Server mit ts-node
```

### Frontend
```bash
cd capital-app/frontend
npm install
npm start
```

## Endpunkte (API)
| Methode | Route | Beschreibung |
|---------|------------------------|--------------------------------|
| GET | `/capital` | Alle Hauptstädte abrufen |
| GET | `/capital/:name` | Hauptstadt nach Name abrufen |
| POST | `/capital` | Neue Hauptstadt anlegen |
| PUT | `/capital/:id` | Hauptstadt bearbeiten |
| DELETE | `/capital/:id` | Hauptstadt löschen |

## Features
- Anzeige einer Liste mit Ländern und Hauptstädten
- Interaktive Karte mit Markern
- Hinzufügen, Bearbeiten und Löschen von Hauptstädten
- Marker-Farben ändern

## Datenbank-Schema
```sql
CREATE TABLE capitals (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    country VARCHAR(255) UNIQUE NOT NULL,
    color TEXT DEFAULT 'red'
);
```

## Entwicklung
Starte Backend und Frontend parallel:
```bash
cd capital-app
concurrently "npm --prefix backend run dev" "npm --prefix frontend start"
```
