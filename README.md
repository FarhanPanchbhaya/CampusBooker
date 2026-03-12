# Campus Booker MVP

A lightweight MVP that shows bookable campus spaces on an interactive map.

## Features

- Red map markers for room locations
- Rooms shown only for allowed buildings
- Click marker to view room image/details
- Description includes hours, accessibility, food policy
- Availability schedule based on JSON booking blocks

## Tech Stack

- React + Vite
- Leaflet + React Leaflet
- JSON files as the data source (no database required for MVP)

## Data you edit

- `src/data/buildings.json`
  - Set `allowed: true/false` to control which buildings appear
- `src/data/rooms.json`
  - Update room details, descriptions, images, and `bookings`

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Suggested next step

When you need real user booking and auth, move bookings from JSON into MongoDB and add an API.
