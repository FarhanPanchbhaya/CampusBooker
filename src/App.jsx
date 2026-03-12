import { useMemo, useState } from "react";
import { MapContainer, Marker, TileLayer, Tooltip } from "react-leaflet";
import L from "leaflet";
import buildings from "./data/buildings.json";
import rooms from "./data/rooms.json";
import RoomDetailsPanel from "./components/RoomDetailsPanel";
import "leaflet/dist/leaflet.css";

const redMarkerIcon = L.divIcon({
	className: "custom-red-marker",
	html: "<span></span>",
	iconSize: [14, 14],
	iconAnchor: [7, 7],
});

function getAllowedBuildingIds() {
	return new Set(buildings.filter((building) => building.allowed).map((building) => building.id));
}

export default function App() {
	const [selectedRoom, setSelectedRoom] = useState(null);

	const allowedBuildingIds = useMemo(() => getAllowedBuildingIds(), []);

	const visibleRooms = useMemo(() => rooms.filter((room) => allowedBuildingIds.has(room.buildingId)), [allowedBuildingIds]);

	return (
		<main className="app-shell">
			<section className="map-section">
				<header className="top-bar">
					<h1>Campus Booker MVP</h1>
					<p>Showing rooms in approved buildings only.</p>
				</header>

				<MapContainer center={[40.731, -73.997]} zoom={17} scrollWheelZoom className="map-canvas">
					<TileLayer
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					/>

					{visibleRooms.map((room) => (
						<Marker
							key={room.roomId}
							position={room.position}
							icon={redMarkerIcon}
							eventHandlers={{
								click: () => setSelectedRoom(room),
							}}>
							<Tooltip>{room.name}</Tooltip>
						</Marker>
					))}
				</MapContainer>
			</section>

			<RoomDetailsPanel room={selectedRoom} />
		</main>
	);
}
