function isLikelyUrl(value) {
	return typeof value === "string" && /^https?:\/\//i.test(value.trim());
}

function normalizeOtherContactInfo(room) {
	const raw = room.otherContactInfo ?? room.OtherContactInfo ?? room.other ?? null;

	if (!raw) {
		return [];
	}

	if (Array.isArray(raw)) {
		return raw
			.map((entry) => {
				if (!entry) return null;

				if (typeof entry === "string") {
					return isLikelyUrl(entry)
						? { kind: "link", label: "Link", url: entry }
						: { kind: "text", text: entry };
				}

				if (typeof entry === "object") {
					if (entry.type === "text" && entry.text) {
						return { kind: "text", text: entry.text };
					}

					if (entry.type === "link" && entry.url) {
						return { kind: "link", label: entry.label || "Link", url: entry.url };
					}

					if (entry.url) {
						return { kind: "link", label: entry.label || "Link", url: entry.url };
					}

					if (entry.text) {
						return { kind: "text", text: entry.text };
					}
				}

				return null;
			})
			.filter(Boolean);
	}

	if (typeof raw === "string") {
		return isLikelyUrl(raw) ? [{ kind: "link", label: "Link", url: raw }] : [{ kind: "text", text: raw }];
	}

	return [];
}

export default function RoomDetailsPanel({ room, roomType, onClose }) {
	if (!room) {
		// This is unused for now since the panel only opens when a room is selected, but could be good default when no room
		return (
			<aside className="details-panel empty">
				<div className="details-sticky-header">
					<span className="room-type-chip">No Space Selected</span>
					<button type="button" className="details-close" onClick={onClose} aria-label="Close room details">
						X
					</button>
				</div>
				<div className="room-body">
					<h2>Select a room marker</h2>
					<p>Pick a space from the list or map marker to view room details and booking contact info.</p>
				</div>
			</aside>
		);
	}

	// Removed emailTemplate logic

	const otherContactEntries = normalizeOtherContactInfo(room);

	return (
		<aside className="details-panel">
			<div className="details-sticky-header">
				<span className="room-type-chip">{roomType || "Room Booking"}</span>
				<button type="button" className="details-close" onClick={onClose} aria-label="Close room details">
					X
				</button>
			</div>
			<img className="room-image" src={room.imageUrl} alt={room.name} />
			<div className="room-body">
				<h2>{room.name}</h2>
				<p className="room-id">{room.roomId}</p>
				<p>{room.description}</p>

				<ul className="meta-list">
					<li>
						<strong>Hours:</strong> {room.hours}
					</li>
					<li>
						<strong>Accessibility:</strong> {(room.accessibility ?? []).join(", ") || "Not listed"}
					</li>
					<li>
						<strong>Food allowed:</strong> {room.foodAllowed ? "Yes" : "No"}
					</li>
					<li>
						<strong>Capacity:</strong> {room.capacity ?? "Not listed"}
					</li>
				</ul>

				<div className="booking-separator" />
				<h3 className="email-title">Booking Contact</h3>
				{room.ownerEmail && (
					<p className="email-contact">
						<strong>Email:</strong> <a href={`mailto:${room.ownerEmail}`}>{room.ownerEmail}</a>
					</p>
				)}
				{otherContactEntries.length > 0 && (
					<div className="other-contact-info">
						<strong>Other Contact Info:</strong>
						<ul className="other-contact-list">
							{otherContactEntries.map((entry, index) => (
								<li key={`${room.roomId}-other-contact-${index}`}>
									{entry.kind === "link" ? (
										<a href={entry.url} target="_blank" rel="noopener noreferrer">
											{entry.label}
										</a>
									) : (
										<span>{entry.text}</span>
									)}
								</li>
							))}
						</ul>
					</div>
				)}

			</div>
		</aside>
	);
}
