import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, TileLayer, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import buildings from "./data/buildings.json";
import rooms from "./data/rooms.json";
import RoomDetailsPanel from "./components/RoomDetailsPanel";
import "leaflet/dist/leaflet.css";

const BRAND_LOGO_PATH = "/logo.png";

const YORK_CAMPUS_CENTER = [43.773161, -79.503109];
const YORK_CAMPUS_BOUNDS = [
	[43.7675, -79.512],
	[43.7788, -79.4955],
];

const MAP_FEATURES = {
	autoFitToVisibleRooms: true,
	campusBoundsAndZoomLimits: true,
};

const redMarkerIcon = L.divIcon({
	className: "custom-red-marker",
	html: "<span></span>",
	iconSize: [16, 16],
	iconAnchor: [8, 8],
});

const selectedRedMarkerIcon = L.divIcon({
	className: "custom-red-marker selected",
	html: "<span></span>",
	iconSize: [26, 26],
	iconAnchor: [13, 13],
});

function getAllowedBuildingIds() {
	return new Set(buildings.filter((building) => building.allowed).map((building) => building.id));
}

function getRoomTypeLabel(room) {
	if (room.roomType) return room.roomType;

	// if no room type is set, infer from the name
	const name = room.name.toLowerCase();
	if (name.includes("lab")) return "Lab";
	if (name.includes("conference") || name.includes("boardroom")) return "Event";
	if (name.includes("studio")) return "Studio";
	if (name.includes("sport") || name.includes("gym")) return "Sport";
	return "Study";
}

function FocusSelectedRoom({ selectedRoom, hasDetailsOpen }) {
	const map = useMap();

	useEffect(() => {
		if (!selectedRoom) return;

		const targetZoom = Math.max(map.getZoom(), 17);
		const sourcePoint = map.project(selectedRoom.position, targetZoom);
		const panelOffset = hasDetailsOpen && window.innerWidth > 980 ? 180 : 0;
		const adjustedCenter = map.unproject(L.point(sourcePoint.x + panelOffset, sourcePoint.y), targetZoom);

		map.flyTo(adjustedCenter, targetZoom, { duration: 0.45 });
	}, [hasDetailsOpen, map, selectedRoom]);

	return null;
}

function FitToVisibleRooms({ roomsToFit, hasDetailsOpen }) {
	const map = useMap();

	useEffect(() => {
		if (!roomsToFit.length) {
			map.setView(YORK_CAMPUS_CENTER, 16);
			return;
		}

		const bounds = L.latLngBounds(roomsToFit.map((room) => room.position));
		const rightPadding = hasDetailsOpen && window.innerWidth > 980 ? 420 : 36;

		map.fitBounds(bounds, {
			paddingTopLeft: [36, 36],
			paddingBottomRight: [rightPadding, 36],
			maxZoom: 18,
		});
	}, [hasDetailsOpen, map, roomsToFit]);

	return null;
}

export default function App() {
	const [selectedRoom, setSelectedRoom] = useState(null);
	const [searchText, setSearchText] = useState("");
	const [activeCategory, setActiveCategory] = useState("All");
	const [logoError, setLogoError] = useState(false);

	useEffect(() => {
		const handleEscapeClose = (event) => {
			if (event.key === "Escape") {
				setSelectedRoom(null);
			}
		};

		window.addEventListener("keydown", handleEscapeClose);
		return () => window.removeEventListener("keydown", handleEscapeClose);
	}, []);

	const allowedBuildingIds = useMemo(() => getAllowedBuildingIds(), []);

	const visibleRooms = useMemo(() => rooms.filter((room) => allowedBuildingIds.has(room.buildingId)), [allowedBuildingIds]);

	const categoryFilteredRooms = useMemo(() => {
		if (activeCategory === "All") return visibleRooms;
		return visibleRooms.filter((room) => getRoomTypeLabel(room) === activeCategory);
	}, [activeCategory, visibleRooms]);

	const filteredRooms = useMemo(() => {
		const query = searchText.trim().toLowerCase();
		if (!query) return categoryFilteredRooms;

		return categoryFilteredRooms.filter((room) => {
			const searchable = `${room.name} ${room.roomId} ${room.buildingId}`.toLowerCase();
			return searchable.includes(query);
		});
	}, [categoryFilteredRooms, searchText]);

	useEffect(() => {
		if (selectedRoom && !filteredRooms.some((room) => room.roomId === selectedRoom.roomId)) {
			setSelectedRoom(null);
		}
	}, [filteredRooms, selectedRoom]);

	return (
		<main className="app-shell">
			<header className="app-topbar">
				<div className="brand-block">
					<div className="brand-mark" aria-hidden="true">
						{!logoError ? <img src={BRAND_LOGO_PATH} alt="" className="brand-logo" onError={() => setLogoError(true)} /> : "⌂"}
					</div>
					<div>
						<h1>Reactivate York</h1>
						<p>Keele Campus Space Finder</p>
					</div>
				</div>
				<div className="topbar-note" aria-label="Project notice">
					<p>
						This site is still a work in progress and spaces are being added. You can suggest a space at <a href="mailto:reactivateyork@gmail.com">reactivateyork@gmail.com </a>
						or contact us on{" "}
						<a href="https://www.instagram.com/reactivateyork/" target="_blank" rel="noopener noreferrer">
							@reactivateyork{" "}
						</a>
						.
					</p>
				</div>
				<div className="chip-row">
					{["All", "Study", "Event", "Lab", "Studio", "Sport"].map((category) => (
						<button type="button" key={category} className={`chip ${activeCategory === category ? "active" : ""}`} onClick={() => setActiveCategory(category)}>
							{category === "All" ? "All Spaces" : category}
						</button>
					))}
					<span className="chip count">{filteredRooms.length} Spaces</span>
				</div>
			</header>

			<section className="main-layout">
				<aside className="spaces-sidebar">
					<h2>Available Spaces</h2>
					<label className="search-box" htmlFor="space-search">
						<span>⌕</span>
						<input id="space-search" type="text" placeholder="Search spaces..." value={searchText} onChange={(event) => setSearchText(event.target.value)} />
					</label>

					<div className="space-list">
						{filteredRooms.map((room) => {
							const isSelected = selectedRoom?.roomId === room.roomId;
							return (
								<button type="button" key={room.roomId} className={`space-row ${isSelected ? "selected" : ""}`} onClick={() => setSelectedRoom(room)}>
									<div className="space-icon">{getRoomTypeLabel(room).slice(0, 1)}</div>
									<div className="space-copy">
										<strong>{room.name}</strong>
										<span>
											{room.buildingId} · {room.roomId}
										</span>
									</div>
									<span className="space-status">Open</span>
								</button>
							);
						})}
					</div>
				</aside>

				<section className="map-stage">
					<MapContainer
						center={YORK_CAMPUS_CENTER}
						zoom={16}
						minZoom={MAP_FEATURES.campusBoundsAndZoomLimits ? 15 : 1}
						maxZoom={MAP_FEATURES.campusBoundsAndZoomLimits ? 18 : 21}
						maxBounds={MAP_FEATURES.campusBoundsAndZoomLimits ? YORK_CAMPUS_BOUNDS : undefined}
						maxBoundsViscosity={MAP_FEATURES.campusBoundsAndZoomLimits ? 1.0 : 0}
						scrollWheelZoom
						className="map-canvas">
						<TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

						{MAP_FEATURES.autoFitToVisibleRooms && <FitToVisibleRooms roomsToFit={filteredRooms} hasDetailsOpen={Boolean(selectedRoom)} />}
						<FocusSelectedRoom selectedRoom={selectedRoom} hasDetailsOpen={Boolean(selectedRoom)} />

						{filteredRooms.map((room) => (
							<Marker
								key={room.roomId}
								position={room.position}
								icon={selectedRoom?.roomId === room.roomId ? selectedRedMarkerIcon : redMarkerIcon}
								zIndexOffset={selectedRoom?.roomId === room.roomId ? 1000 : 0}
								eventHandlers={{
									click: () => setSelectedRoom(room),
								}}>
								<Tooltip direction="top" offset={[0, -10]}>{`${room.name} (${room.roomId})`}</Tooltip>
							</Marker>
						))}
					</MapContainer>

					{selectedRoom && (
						<div className="details-overlay">
							<RoomDetailsPanel room={selectedRoom} roomType={getRoomTypeLabel(selectedRoom)} onClose={() => setSelectedRoom(null)} />
						</div>
					)}
				</section>
			</section>
		</main>
	);
}
