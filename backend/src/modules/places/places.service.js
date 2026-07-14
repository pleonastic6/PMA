const { AppError } = require('../../common/errors/app-error');

function normalizeSearchQuery(query) {
    return String(query || '').trim();
}

function mapPlaceResult(entry) {
    const latitude = Number(entry.lat);
    const longitude = Number(entry.lon);
    const primaryLabel = entry.name || entry.display_name?.split(',')[0] || 'Ort';
    const secondaryLabel = entry.display_name || primaryLabel;

    return {
        id: String(entry.place_id),
        name: primaryLabel,
        label: secondaryLabel,
        position: [latitude, longitude],
    };
}

async function searchPlaces(query, fetchFn = fetch) {
    const normalizedQuery = normalizeSearchQuery(query);

    if (normalizedQuery.length < 3) {
        throw new AppError(400, 'Suchbegriff muss mindestens 3 Zeichen lang sein');
    }

    const url = new URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.set('q', normalizedQuery);
    url.searchParams.set('format', 'jsonv2');
    url.searchParams.set('limit', '5');
    url.searchParams.set('addressdetails', '0');

    const response = await fetchFn(url, {
        headers: {
            'User-Agent': 'PMA/1.0 (event place lookup)',
            'Accept-Language': 'de,en',
        },
    });

    if (!response.ok) {
        throw new AppError(502, 'Ortssuche gerade nicht verfuegbar');
    }

    const results = await response.json();
    return Array.isArray(results) ? results.map(mapPlaceResult) : [];
}

module.exports = {
    searchPlaces,
};
