import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import LocationMarker from './LocationMarker';
import UserZone from './UserZone';

export default function MapWidget({
  center = [18.3, -64.825],
  zoom = 16,
  locations = [],
  users = []
}) {
  return (
    <div className="w-full h-full relative z-0">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Render Meeting Points (Exact Markers) */}
        {locations.map((loc, index) => (
          <LocationMarker
            key={`loc-${index}`}
            position={loc.position}
            name={loc.name}
            description={loc.description}
          />
        ))}

        {/* Render User Zones (Diffuse Circles for Privacy) */}
        {users.map((user, index) => (
          <UserZone
            key={`user-${index}`}
            center={user.center}
            radius={user.radius}
            name={user.name}
            color={user.color}
          />
        ))}
      </MapContainer>
    </div>
  );
}
