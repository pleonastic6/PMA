import { useMemo, useState } from 'react';
import { Filter, MapPin, Users } from 'lucide-react';

import MapWidget from '../../components/Map/MapWidget';
import { useAppState } from '../../context/AppStateContext';

export default function MapPage() {
  const { filteredMeetingPoints, nearbyUsers, preferences } = useAppState();
  const [selectedPointId, setSelectedPointId] = useState(filteredMeetingPoints[0]?.id ?? null);
  const [showLegend, setShowLegend] = useState(false);

  const selectedPoint = useMemo(
    () => filteredMeetingPoints.find((point) => point.id === selectedPointId) ?? filteredMeetingPoints[0],
    [filteredMeetingPoints, selectedPointId]
  );

  const initialCenter = selectedPoint?.position ?? [18.3, -64.825];

  return (
    <div className="relative w-full" style={{ height: 'calc(100vh - 64px)' }}>
      <MapWidget center={initialCenter} zoom={16} locations={filteredMeetingPoints} users={nearbyUsers} />

      <div className="absolute right-4 top-4 z-[400] flex flex-col gap-3">
        <button
          onClick={() => setShowLegend((prev) => !prev)}
          className="rounded-full border border-gray-200 bg-white p-3 shadow-lg transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-[#101010] dark:text-white dark:hover:bg-gray-800"
        >
          <Filter size={20} />
        </button>
        {showLegend && (
          <div className="w-72 rounded-3xl bg-white p-4 shadow-2xl dark:bg-[#181b22] dark:text-white">
            <p className="text-sm font-semibold text-violet-500">Kartenfilter</p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Treffpunkte passen sich an deine aktuellen Interessen an. Radius: {preferences.radiusKm} km.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {preferences.interestFilters.map((interest) => (
                <span key={interest} className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-500/10 dark:text-violet-200">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-4 left-4 right-4 z-[400] mx-auto flex max-w-6xl flex-col gap-4 lg:flex-row">
        <div className="max-h-52 flex-1 overflow-auto rounded-3xl bg-white p-4 shadow-2xl dark:bg-[#181b22] dark:text-white">
          <div className="mb-3 flex items-center gap-2">
            <MapPin size={16} className="text-violet-500" />
            <h2 className="font-bold">Treffpunkte</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {filteredMeetingPoints.map((point) => {
              const active = point.id === selectedPoint?.id;
              return (
                <button
                  key={point.id}
                  type="button"
                  onClick={() => setSelectedPointId(point.id)}
                  className={`rounded-2xl border p-4 text-left transition ${active ? 'border-violet-300 bg-violet-50 dark:border-violet-500/40 dark:bg-violet-500/10' : 'border-gray-100 hover:bg-gray-50 dark:border-white/10 dark:hover:bg-white/5'}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold">{point.name}</p>
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-[11px] font-semibold text-gray-600 dark:bg-white/10 dark:text-gray-300">
                      {point.category}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{point.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {selectedPoint && (
          <div className="w-full rounded-3xl bg-[#181b22] p-5 text-white shadow-2xl lg:max-w-sm">
            <div className="mb-3 flex items-center gap-2 text-violet-300">
              <Users size={16} />
              <p className="text-sm font-semibold">Spotlight</p>
            </div>
            <h3 className="text-xl font-bold">{selectedPoint.name}</h3>
            <p className="mt-2 text-sm text-white/75">{selectedPoint.description}</p>
            <div className="mt-4 rounded-2xl bg-white/5 p-4 text-sm text-white/80">
              Passt besonders gut zu: {selectedPoint.category} · {preferences.interestFilters.slice(0, 2).join(' & ')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
