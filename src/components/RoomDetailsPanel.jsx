function formatDateTime(isoDate) {
	return new Date(isoDate).toLocaleString([], {
		weekday: "short",
		hour: "2-digit",
		minute: "2-digit",
	});
}


export default function RoomDetailsPanel({ room }) {
	if (!room) {
		return (
			<aside className="details-panel empty">
				<h2>Select a room marker</h2>
				<p>Click a red marker on the map to view room details and booking schedule.</p>
			</aside>
		);
	}


	return (
		<aside className="details-panel">
			<img className="room-image" src={room.imageUrl} alt={room.name} />
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
			</ul>

			<h3>Email Template</h3>
			{room.ownerEmail && (
				<p><strong>Contact:</strong> <a href={`mailto:${room.ownerEmail}`}>{room.ownerEmail}</a></p>
			)}
			<p>Copy and fill out this template to request a booking:</p>
			<pre className="email-template" style={{background:'#f7f7fa',padding:'0.7em',borderRadius:'7px',overflowX:'auto'}}>
			{room.emailTemplate || `Subject: Room Booking Request – ${room.name}

				Hello,

				I would like to request a booking for the following space:
				Room: ${room.name} (${room.roomId})
				Date & Time: [your preferred date/time]
				Purpose: [brief description]

				Please let me know if the space is available or if you need more information.

				Thank you!
				[your name]`}
			</pre>
		</aside>
	);
}
