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

	const emailTemplate =
		room.emailTemplate ||
		`Subject: Room Booking Request - ${room.name}

Hello,

I would like to request a booking for the following space:
Room: ${room.name} (${room.roomId})
Date and Time: [your preferred date/time]
Purpose: [brief description]

Please let me know if the space is available or if you need more information.

Thank you,
[your name]`;

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

				<h3 className="email-title">Booking Contact</h3>
				{room.ownerEmail && (
					<p className="email-contact">
						<strong>Email:</strong> <a href={`mailto:${room.ownerEmail}`}>{room.ownerEmail}</a>
					</p>
				)}
				{room.OtherContactInfo && (
						<p className="other-contact-info">
							<strong>Other Contact Info:</strong> <a href={room.OtherContactInfo} target="_blank" rel="noopener noreferrer">
								Link to Booking Form
							</a>
						</p>
				)}

			
				<pre className="email-template">{emailTemplate}</pre>
			</div>
		</aside>
	);
}
