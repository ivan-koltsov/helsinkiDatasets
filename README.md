# Helsinki Region Data Sources

A small web application for the sales team to track dataset availability and freshness across Helsinki, Espoo, Vantaa, and surrounding municipalities.

## Architecture

- **Frontend**: React, TypeScript, Leaflet.js
- **Backend**: Python Flask, SQLAlchemy, PostgreSQL
- **Containerization**: Docker & Docker Compose

## Features

1.  **Area Lookup**: Click a district on the map to see available datasets and their freshness.
2.  **Dataset Reach**: Select a dataset to highlight all covered districts on the map.

## Setup & Run

1.  **Clone the repository**.
2.  **Run with Docker Compose**:
    ```bash
    docker-compose up --build
    ```
3.  **Access the application**:
    - Frontend: [http://localhost:3000](http://localhost:3000)
    - Backend API: [http://localhost:5001/api](http://localhost:5001/api)

## Implementation Details

- **Database**: PostgreSQL with three models: `Dataset`, `Zone`, and `Coverage`.
- **Seed Script**: A script (`backend/seed.py`) runs automatically on startup to populate the database with sample data.
- **Freshness Labels**:
    - `Fresh`: < 30 days
    - `Ageing`: 30-90 days
    - `Stale`: > 90 days

## Known Gaps / Improvements

- Polygons for districts instead of simple circle markers (requires GeoJSON data).
- Persistent state management (e.g., Redux or React Context) for complex interactions.
- Enhanced search and filtering.
- Production-ready deployment setup (Nginx, Gunicorn, etc.).