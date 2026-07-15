const { User } = require('../users/user.model');
const { Swipe } = require('../matches/swipe.model');
const { publicUser } = require('../auth/auth.service');
const { calculateAge } = require('../../common/utils/profile');
const eventsService = require('../events/events.service');

function matchesAgePreferences(candidate, currentUser) {
    const candidateAge = calculateAge(candidate.birthDate);
    const currentUserAge = calculateAge(currentUser.birthDate);

    const currentUserMinAge = currentUser.preferences?.minAge ?? 18;
    const currentUserMaxAge = currentUser.preferences?.maxAge ?? 99;
    const candidateMinAge = candidate.preferences?.minAge ?? 18;
    const candidateMaxAge = candidate.preferences?.maxAge ?? 99;

    const currentUserAcceptsCandidate = candidateAge === null
        ? true
        : candidateAge >= currentUserMinAge && candidateAge <= currentUserMaxAge;
    const candidateAcceptsCurrentUser = currentUserAge === null
        ? true
        : currentUserAge >= candidateMinAge && currentUserAge <= candidateMaxAge;

    return currentUserAcceptsCandidate && candidateAcceptsCurrentUser;
}

async function listPeopleCandidates(currentUserId) {
    const currentUser = await User.findById(currentUserId).lean();
    const swipes = await Swipe.find({ swiperUserId: currentUserId }).lean();
    const excludedIds = swipes.map((swipe) => String(swipe.targetUserId));
    excludedIds.push(String(currentUserId));

    const candidates = await User.find({
        _id: { $nin: excludedIds },
        meetupStatus: 'active',
    })
        .sort({ createdAt: -1 })
        .limit(25)
        .lean();

    return {
        currentUser,
        people: candidates
            .filter((candidate) => matchesAgePreferences(candidate, currentUser))
            .map(publicUser),
    };
}

function buildInterestCards(currentUser, people, events) {
    const counts = new Map();

    for (const person of people) {
        for (const interest of person.interests || []) {
            const key = String(interest).trim();
            if (!key) {
                continue;
            }

            const entry = counts.get(key) || { people: 0, eventTitles: [] };
            entry.people += 1;
            counts.set(key, entry);
        }
    }

    for (const event of events) {
        const category = String(event.category || '').trim();
        if (!category || category === 'Sonstiges') {
            continue;
        }

        const entry = counts.get(category) || { people: 0, eventTitles: [] };
        entry.eventTitles = [...new Set([...entry.eventTitles, event.title])];
        counts.set(category, entry);
    }

    for (const interest of currentUser?.interests || []) {
        const key = String(interest).trim();
        if (!key) {
            continue;
        }

        const entry = counts.get(key) || { people: 0, eventTitles: [] };
        counts.set(key, entry);
    }

    return [...counts.entries()]
        .sort(([, left], [, right]) => {
            const rightScore = right.people + right.eventTitles.length;
            const leftScore = left.people + left.eventTitles.length;
            return rightScore - leftScore;
        })
        .slice(0, 12)
        .map(([name, meta], index) => ({
            id: `interest-${index}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
            name,
            description:
                meta.eventTitles.length > 0
                    ? `Taucht in Profilen auf und passt zu Events wie ${meta.eventTitles.slice(0, 2).join(', ')}.`
                    : 'Taucht in mehreren Profilen als gemeinsamer Interessensanker auf.',
            peopleCount: meta.people,
            eventTitles: meta.eventTitles.slice(0, 3),
            isOwnInterest: (currentUser?.interests || []).includes(name),
        }));
}

function normalizeLocationKey(value) {
    return String(value || '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ' ');
}

function buildLocationCards(currentUser, people, events) {
    const cards = new Map();

    for (const person of [...people, currentUser].filter(Boolean)) {
        const name = String(person.location || person.hometown || '').trim();
        if (!name) {
            continue;
        }

        const key = normalizeLocationKey(name);
        const entry = cards.get(key) || {
            id: `location-${key.replace(/[^a-z0-9]+/g, '-')}`,
            name,
            residentCount: 0,
            eventCount: 0,
            eventTitles: [],
            position: null,
        };

        entry.residentCount += 1;
        cards.set(key, entry);
    }

    for (const event of events) {
        const name = String(event.locationName || '').trim();
        if (!name) {
            continue;
        }

        const key = normalizeLocationKey(name);
        const entry = cards.get(key) || {
            id: `location-${key.replace(/[^a-z0-9]+/g, '-')}`,
            name,
            residentCount: 0,
            eventCount: 0,
            eventTitles: [],
            position: null,
        };

        entry.eventCount += 1;
        entry.eventTitles = [...new Set([...entry.eventTitles, event.title])];
        entry.position = entry.position || event.position || null;
        cards.set(key, entry);
    }

    return [...cards.values()]
        .sort((left, right) => (right.eventCount + right.residentCount) - (left.eventCount + left.residentCount))
        .slice(0, 10)
        .map((location) => ({
            ...location,
            description:
                location.eventCount > 0
                    ? `${location.eventCount} Event(s) und ${location.residentCount} Profil(e) mit Bezug zu diesem Ort.`
                    : `${location.residentCount} Profil(e) nennen diesen Ort bereits als Bezugspunkt.`,
        }));
}

async function listDiscovery(currentUserId) {
    const [{ currentUser, people }, events] = await Promise.all([
        listPeopleCandidates(currentUserId),
        eventsService.listEvents(),
    ]);

    return {
        people,
        interests: buildInterestCards(currentUser, people, events),
        events: events.slice(0, 12),
        locations: buildLocationCards(currentUser, people, events),
    };
}

module.exports = {
    listDiscovery,
    listPeopleCandidates,
};
