import React, { useEffect, useState } from 'react';
import MapWidget from '../../components/Map/MapWidget';
import { Filter } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function MapPage() {
  const { isAuthenticated, getMapOverview } = useAuth();
  const [mapData, setMapData] = useState({
    center: [49.444, 11.848],
    events: [],
    users: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    getMapOverview()
      .then((data) => {
        if (active) {
          setMapData(data);
        }
      })
      .catch((loadError) => {
        if (active) {
          setError(loadError.message);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [isAuthenticated, getMapOverview]);

  return (
    <div className="relative w-full" style={{ height: 'calc(100vh - 64px)' }}>
      {loading ? (
        <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
          Karte wird geladen...
        </div>
      ) : (
        <MapWidget
          center={mapData.center}
          zoom={14}
          locations={mapData.events}
          users={mapData.users}
        />
      )}

      {/* Floating UI Elements (e.g., Filter Button) */}
      <div className="absolute top-4 right-4 z-[400]">
        <button className="bg-white dark:bg-[#101010] dark:text-white p-3 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <Filter size={20} />
        </button>
      </div>
      {error ? (
        <div className="absolute left-4 bottom-4 z-[400] rounded-xl bg-white/95 px-4 py-3 text-sm text-red-600 shadow-lg dark:bg-[#101010]/95">
          {error}
        </div>
      ) : null}
    </div>
  );
}
