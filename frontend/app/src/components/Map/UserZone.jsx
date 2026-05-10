import React from 'react';
import { Circle, Popup } from 'react-leaflet';

export default function UserZone({ center, radius = 300, name, color = "#434FDA" }) {
  return (
    <Circle
      center={center}
      pathOptions={{ color, fillColor: color, fillOpacity: 0.2, weight: 1 }}
      radius={radius}
    >
      <Popup>
        <div className="text-center">
          <p className="font-semibold text-sm">Nutzerzone</p>
          {name && <p className="text-xs text-gray-600">{name}</p>}
        </div>
      </Popup>
    </Circle>
  );
}
