import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import buildings from "./data/buildings.json";
import rooms from "./data/rooms.json";
import RoomDetailsPanel from "./components/RoomDetailsPanel";
import "leaflet/dist/leaflet.css";

const YORK_CAMPUS_CENTER = [43.773161, -79.503109];
const YORK_CAMPUS_BOUNDS = [
	[43.7675, -79.512],
	[43.7788, -79.4955],
];
const MAP_FEATURES = {
	autoFitToVisibleRooms: true,
	markerPopups: true,
	campusBoundsAndZoomLimits: true,
};

const redMarkerIcon = L.divIcon({
	className: "custom-red-marker",
	html: "<span></span>",
	iconSize: [16, 16],
	iconAnchor: [8, 8],
});

function getAllowedBuildingIds() {
	return new Set(buildings.filter((building) => building.allowed).map((building) => building.id));
}



function FitToVisibleRooms({ roomsToFit }) {
	const map = useMap();

	useEffect(() => {
		if (!roomsToFit.length) {
			map.setView(YORK_CAMPUS_CENTER, 16);
			return;
		}

		const bounds = L.latLngBounds(roomsToFit.map((room) => room.position));
		map.fitBounds(bounds, { padding: [36, 36], maxZoom: 18 });
	}, [map, roomsToFit]);

	return null;
}

export default function App() {
	const [selectedRoom, setSelectedRoom] = useState(null);

	const allowedBuildingIds = useMemo(() => getAllowedBuildingIds(), []);

	const visibleRooms = useMemo(() => rooms.filter((room) => allowedBuildingIds.has(room.buildingId)), [allowedBuildingIds]);

	return (
		<main className="app-shell">
			<section className="map-section">
				<header className="top-bar">
					<h1>Campus Booker</h1>
					<p>Showing rooms in approved buildings only.</p>
				</header>

				<MapContainer
					center={YORK_CAMPUS_CENTER}
					zoom={16}
					minZoom={MAP_FEATURES.campusBoundsAndZoomLimits ? 15 : 1}
					maxZoom={MAP_FEATURES.campusBoundsAndZoomLimits ? 19 : 21}
					maxBounds={MAP_FEATURES.campusBoundsAndZoomLimits ? YORK_CAMPUS_BOUNDS : undefined}
					maxBoundsViscosity={MAP_FEATURES.campusBoundsAndZoomLimits ? 1.0 : 0}
					scrollWheelZoom
					className="map-canvas">
					<TileLayer
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					/>

					{MAP_FEATURES.autoFitToVisibleRooms && <FitToVisibleRooms roomsToFit={visibleRooms} />}

					{visibleRooms.map((room) => (
						<Marker
							key={room.roomId}
							position={room.position}
							icon={redMarkerIcon}
							eventHandlers={{
								click: () => setSelectedRoom(room),
							}}>
							<Tooltip>{room.name}</Tooltip>
							{MAP_FEATURES.markerPopups && (
								<Popup>
									<strong>{room.name}</strong>
									<br />
									{room.roomId}
									<br />
									{room.hours}
								</Popup>
							)}
						</Marker>
					))}
				</MapContainer>
			</section>

			<RoomDetailsPanel room={selectedRoom} />
		</main>
	);
}
