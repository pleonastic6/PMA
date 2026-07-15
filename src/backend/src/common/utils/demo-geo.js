const DEFAULT_MAP_CENTER = [49.444, 11.848];

function normalizeCoordinate(value) {
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
}

function normalizePosition(position) {
    if (!Array.isArray(position) || position.length !== 2) {
        return null;
    }

    const latitude = normalizeCoordinate(position[0]);
    const longitude = normalizeCoordinate(position[1]);

    if (latitude === null || longitude === null) {
        return null;
    }

    return [latitude, longitude];
}

function hashSeed(seed) {
    const input = String(seed || 'friends');
    let hash = 0;

    for (let index = 0; index < input.length; index += 1) {
        hash = (hash * 31 + input.charCodeAt(index)) >>> 0;
    }

    return hash;
}

function randomFromSeed(seed) {
    const base = hashSeed(seed);
    return (base % 10000) / 10000;
}

function seededPosition(seed, center = DEFAULT_MAP_CENTER, spread = 0.045) {
    const latitudeOffset = (randomFromSeed(`${seed}:lat`) - 0.5) * spread;
    const longitudeOffset = (randomFromSeed(`${seed}:lng`) - 0.5) * spread;

    return [
        Number((center[0] + latitudeOffset).toFixed(6)),
        Number((center[1] + longitudeOffset).toFixed(6)),
    ];
}

module.exports = {
    DEFAULT_MAP_CENTER,
    normalizePosition,
    seededPosition,
};
