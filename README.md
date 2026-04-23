# Campus Booker

A lightweight site/program that shows York University's easily bookable campus spaces on an interactive map, along with instructions on how to book the space. See the website [here](https://reactivateyork-booker.vercel.app/).

## Features

- Red map markers for room locations
- Click marker to view room image/details
- Description includes hours, accessibility, food policy
- Booking information including contacts or forms

## Tech Stack

- React + Vite
- Leaflet + React Leaflet
- JSON files as the data source (may switch to database in future)

## JSON

- `src/data/rooms.json`
  - Update room details, descriptions, images, and booking contact
  - Set `roomType` for top filter categories: `Study`, `Event`, `Lab`, `Studio`, `Sport`
  - `otherContactInfo` supports mixed text and links

Example `otherContactInfo` format:

```json
"otherContactInfo": [
  { "type": "text", "text": "Bookings require college approval first." },
  { "type": "link", "label": "Booking Form", "url": "https://example.com/form" },
  "https://example.com/alternate-link"
]
```




## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```


