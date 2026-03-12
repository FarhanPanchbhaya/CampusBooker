function formatDateTime(isoDate) {
  return new Date(isoDate).toLocaleString([], {
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function isRoomFreeNow(bookings) {
  const now = new Date();
  return !bookings.some((booking) => {
    const start = new Date(booking.start);
    const end = new Date(booking.end);
    return now >= start && now <= end;
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

  const freeNow = isRoomFreeNow(room.bookings ?? []);

  return (
    <aside className="details-panel">
      <img className="room-image" src={room.imageUrl} alt={room.name} />
      <h2>{room.name}</h2>
      <p className="room-id">{room.roomId}</p>
      <p>{room.description}</p>

      <ul className="meta-list">
        <li><strong>Hours:</strong> {room.hours}</li>
        <li><strong>Accessibility:</strong> {(room.accessibility ?? []).join(', ') || 'Not listed'}</li>
        <li><strong>Food allowed:</strong> {room.foodAllowed ? 'Yes' : 'No'}</li>
        <li><strong>Status now:</strong> {freeNow ? 'Free' : 'Currently booked'}</li>
      </ul>

      <h3>Availability schedule</h3>
      {room.bookings?.length ? (
        <ul className="schedule-list">
          {room.bookings.map((booking) => (
            <li key={`${room.roomId}-${booking.start}`}>
              {formatDateTime(booking.start)} - {formatDateTime(booking.end)}
            </li>
          ))}
        </ul>
      ) : (
        <p>No current bookings listed.</p>
      )}
    </aside>
  );
}
