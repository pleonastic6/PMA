import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons not showing in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

export default function LocationMarker({ position, name, description }) {
  return (
    <Marker position={position}>
      <Popup>
        <div className="text-center">
          <h3 className="font-bold text-sm">{name}</h3>
          {description && <p className="text-xs mt-1 text-gray-600">{description}</p>}
        </div>
      </Popup>
    </Marker>
  );
}
