import React, { useState } from 'react';
import MapWidget from '../../components/Map/MapWidget';
import { Filter } from 'lucide-react';

export default function MapPage() {
  // Initial coordinates from requirements
  const initialCenter = [18.3, -64.825];

  // Mock Data: Meeting Points (Exact locations)
  const mockLocations = [
    {
      position: [18.301, -64.826],
      name: "Café de la Marina",
      description: "Gemütliches Café mit Meerblick."
    },
    {
      position: [18.298, -64.824],
      name: "Stadtpark Treffpunkt",
      description: "Perfekt für ein Picknick."
    },
    {
      position: [18.302, -64.822],
      name: "Zentralbibliothek",
      description: "Ruhiger Ort zum Lernen und Treffen."
    }
  ];

  // Mock Data: User Zones (Approximate locations for privacy)
  const mockUsers = [
    {
      center: [18.303, -64.828],
      radius: 300, // in meters
      name: "Nutzer in der Nähe",
      color: "#FF5733"
    },
    {
      center: [18.296, -64.827],
      radius: 400,
      name: "Anonymer Freund",
      color: "#33FF57"
    },
    {
      center: [18.299, -64.821],
      radius: 250,
      name: "Jemand sucht nach Treffen",
      color: "#3357FF"
    }
  ];

  return (
    <div className="relative w-full" style={{ height: 'calc(100vh - 64px)' }}>
      {/*
        The map takes up all available height.
        We subtract the approximate navbar height (64px).
      */}
      <MapWidget
        center={initialCenter}
        zoom={16}
        locations={mockLocations}
        users={mockUsers}
      />

      {/* Floating UI Elements (e.g., Filter Button) */}
      <div className="absolute top-4 right-4 z-[400]">
        <button className="bg-white dark:bg-[#101010] dark:text-white p-3 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <Filter size={20} />
        </button>
      </div>
    </div>
  );
}
