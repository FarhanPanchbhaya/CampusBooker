# Campus Booker

A lightweight site/program that shows York University's easily bookable campus spaces on an interactive map.

## Features

- Red map markers for room locations
- Click marker to view room image/details
- Description includes hours, accessibility, food policy

## Tech Stack

- React + Vite
- Leaflet + React Leaflet
- JSON files as the data source (may switch to database in future)

## JSON

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


