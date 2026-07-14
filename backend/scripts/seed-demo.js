const crypto = require('node:crypto');

const { connectDatabase, disconnectDatabase } = require('../src/db/mongoose');
const { hashPassword } = require('../src/common/utils/password');
const { User } = require('../src/modules/users/user.model');
const { Session } = require('../src/modules/auth/session.model');
const { Swipe } = require('../src/modules/matches/swipe.model');
const { Message } = require('../src/modules/chat/message.model');
const { Event } = require('../src/modules/events/event.model');

function conversationKey(userAId, userBId) {
    return [String(userAId), String(userBId)].sort().join(':');
}

function avatarDataUrl(label, startColor, endColor) {
    const initials = String(label || '?')
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join('');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 640 640"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="${startColor}"/><stop offset="1" stop-color="${endColor}"/></linearGradient></defs><rect width="640" height="640" rx="64" fill="url(#g)"/><circle cx="320" cy="240" r="110" fill="rgba(255,255,255,0.22)"/><path d="M160 520c28-86 92-130 160-130s132 44 160 130" fill="rgba(255,255,255,0.22)"/><text x="320" y="590" font-size="88" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-weight="700">${initials}</text></svg>`;
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

async function createUser(data) {
    const passwordHash = await hashPassword(data.password);

    return User.create({
        username: data.username,
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        displayName: data.displayName,
        birthDate: data.birthDate,
        gender: data.gender,
        location: data.location,
        bio: data.bio,
        interests: data.interests,
        languages: data.languages,
        icebreaker: data.icebreaker,
        meetupStatus: data.meetupStatus || 'active',
        preferences: data.preferences || { minAge: 18, maxAge: 99 },
        pictures: data.pictures || [],
    });
}

async function createSession(user) {
    const token = crypto.randomBytes(32).toString('hex');
    await Session.create({
        userId: user._id,
        token,
    });

    return token;
}

async function resetCollections() {
    await Promise.all([
        Message.deleteMany({}),
        Swipe.deleteMany({}),
        Session.deleteMany({}),
        Event.deleteMany({}),
        User.deleteMany({}),
    ]);
}

async function main() {
    await connectDatabase();
    await resetCollections();

    const users = {};
    const sessions = {};

    const userSeeds = [
        {
            username: 'neo',
            email: 'neo@pma.local',
            password: 'demo12345',
            firstName: 'Neo',
            lastName: 'Anderson',
            displayName: 'Neo',
            birthDate: '1998-05-10',
            gender: 'male',
            location: 'Amberg',
            bio: 'Informatikstudent, Kaffee, kleine Projekte und spontane Abende in der Stadt.',
            interests: ['Coding', 'Kaffee', 'Kneipenquiz'],
            vibeTags: ['Dry Humor', 'Nerdy', 'Spontan'],
            languages: ['Deutsch', 'Englisch'],
            icebreaker: 'Ich finde meistens die beste Bar durch Trial and Error.',
            jobTitle: 'Informatikstudent',
            education: 'OTH Amberg-Weiden',
            lookingFor: 'Leute fuer Quiz, Kaffee und random Aktionen',
            hometown: 'Amberg',
            favoriteHangout: 'Irgendein Cafe mit Steckdosen',
            weekendMood: 'Spontan, aber bitte mit Kaffee',
            idealSunday: 'Flohmarkt, Spaziergang, abends irgendwas basteln',
            greenFlags: 'Humor, Direktheit, kein Stress wegen Kleinigkeiten',
            funFact: 'Ich mache aus fast allem irgendwann ein kleines Tool.',
            pictures: [avatarDataUrl('Neo', '#6D5BFF', '#00C2FF')],
        },
        {
            username: 'trinity',
            email: 'trinity@pma.local',
            password: 'demo12345',
            firstName: 'Trinity',
            lastName: 'Moss',
            displayName: 'Trinity',
            birthDate: '1999-11-21',
            gender: 'female',
            location: 'Amberg',
            bio: 'Mag Tech-Talk, gute Drinks und Leute mit trockenem Humor.',
            interests: ['Techno', 'Design', 'Cocktails'],
            vibeTags: ['Stylish', 'Sharp', 'Night Owl'],
            languages: ['Deutsch', 'Englisch'],
            icebreaker: 'Wenn du einen schlechten Wortwitz hast, raus damit.',
            jobTitle: 'UX Designerin',
            education: 'FH Regensburg',
            lookingFor: 'Menschen mit Humor und eigenen Interessen',
            hometown: 'Regensburg',
            favoriteHangout: 'Bar mit guter Musik und wenig Cringe',
            weekendMood: 'Abends raus, tagsueber langsam',
            idealSunday: 'Spaetes Fruehstueck und dann irgendwo hin, wo es schoen ist',
            greenFlags: 'Kann Geschichten erzaehlen und gute Fragen stellen',
            funFact: 'Ich sortiere Playlists uebertrieben ernst.',
            pictures: [avatarDataUrl('Trinity', '#FF7A7A', '#FFB36B')],
        },
        {
            username: 'morpheus',
            email: 'morpheus@pma.local',
            password: 'demo12345',
            firstName: 'Morpheus',
            lastName: 'Smith',
            displayName: 'Morpheus',
            birthDate: '1996-02-14',
            gender: 'male',
            location: 'Nürnberg',
            bio: 'Konzerte, Basketball und nächtliche Diskussionen über alles und nichts.',
            interests: ['Sport', 'Konzerte', 'Philosophie'],
            vibeTags: ['Deep Talks', 'Sporty'],
            languages: ['Deutsch'],
            icebreaker: 'Ich judge Leute nach ihrer Lieblings-Pommesbude.',
            jobTitle: 'Werkstudent IT',
            education: 'TH Nuernberg',
            lookingFor: 'Entspannte Leute fuer Events und gute Gespraeche',
            hometown: 'Nuernberg',
            favoriteHangout: 'Irgendwo draussen mit Musik',
            weekendMood: 'Tagsueber aktiv, nachts philosophisch',
            idealSunday: 'Basketball, Food und spaeter Konzert',
            greenFlags: 'Laesst andere ausreden und hat eigene Meinung',
            funFact: 'Ich merke mir unnuetze Musik-Fakten viel zu gut.',
            pictures: [avatarDataUrl('Morpheus', '#1F9D8B', '#7ED957')],
        },
        {
            username: 'switch',
            email: 'switch@pma.local',
            password: 'demo12345',
            firstName: 'Switch',
            lastName: 'Lane',
            displayName: 'Switch',
            birthDate: '2000-07-03',
            gender: 'other',
            location: 'Regensburg',
            bio: 'Offen fuer spontane Treffen, Brettspiele und dumme Ideen mit guter Umsetzung.',
            interests: ['Brettspiele', 'Bars', 'Memes'],
            vibeTags: ['Chaotic Good', 'Funny', 'Curious'],
            languages: ['Deutsch', 'Englisch'],
            icebreaker: 'Welches Meme beschreibt deinen Tag bisher am besten?',
            jobTitle: 'Medieninformatik',
            education: 'Uni Regensburg',
            lookingFor: 'Leute fuer Spieleabende und dumme, gute Ideen',
            hometown: 'Regensburg',
            favoriteHangout: 'WG-Kuechen mit guter Musik',
            weekendMood: 'Hauptsache was los',
            idealSunday: 'Spontaner Ausflug ohne Plan',
            greenFlags: 'Locker, ehrlich, nicht uebertrieben cool',
            funFact: 'Ich gewinne Mario Kart nur aus purem Trotz.',
            pictures: [avatarDataUrl('Switch', '#F97316', '#FACC15')],
        },
        {
            username: 'pixel',
            email: 'pixel@pma.local',
            password: 'demo12345',
            firstName: 'Lena',
            lastName: 'Graf',
            displayName: 'Pixel',
            birthDate: '2001-03-18',
            gender: 'female',
            location: 'Regensburg',
            bio: 'UI-Kram, Flohmaerkte, Matcha und Spaziergaenge ohne Ziel.',
            interests: ['Design', 'Cafes', 'Fotografie'],
            vibeTags: ['Soft', 'Creative', 'City Walks'],
            languages: ['Deutsch', 'Englisch'],
            icebreaker: 'Zeig mir deinen most cursed Screenshot.',
            jobTitle: 'Werkstudentin Design',
            education: 'TH Deggendorf',
            lookingFor: 'Menschen fuer gute Gespraeche und kleine Dates',
            hometown: 'Regensburg',
            favoriteHangout: 'Flohmarkt oder Specialty-Coffee-Laden',
            weekendMood: 'Langsam starten, spaeter treiben lassen',
            idealSunday: 'Secondhand, Matcha, Abendsonne',
            greenFlags: 'Nett zu Service-Leuten und kreativ im Kopf',
            funFact: 'Ich mache Screenshots von schoener Typografie.',
            pictures: [avatarDataUrl('Pixel', '#EC4899', '#8B5CF6')],
        },
        {
            username: 'atlas',
            email: 'atlas@pma.local',
            password: 'demo12345',
            firstName: 'Jonas',
            lastName: 'Berg',
            displayName: 'Atlas',
            birthDate: '1997-09-08',
            gender: 'male',
            location: 'Nuernberg',
            bio: 'Kletterhalle, Indie-Konzerte und spontane Wochenendtrips.',
            interests: ['Bouldern', 'Konzerte', 'Roadtrips'],
            vibeTags: ['Active', 'Indie', 'Roadtrip Brain'],
            languages: ['Deutsch', 'Englisch'],
            icebreaker: 'Ich plane Trips schlecht, aber sie werden gut.',
            jobTitle: 'Projektmanager',
            education: 'FAU Erlangen',
            lookingFor: 'Leute mit Energie und Lust auf Unternehmungen',
            hometown: 'Nuernberg',
            favoriteHangout: 'Kletterhalle oder kleiner Club',
            weekendMood: 'Raus, nicht rumsitzen',
            idealSunday: 'Frueh losfahren, spaet heimkommen',
            greenFlags: 'Zieht Sachen durch und ist trotzdem entspannt',
            funFact: 'Ich habe immer irgendwo eine Playlist fuer die Fahrt.',
            pictures: [avatarDataUrl('Atlas', '#0EA5E9', '#14B8A6')],
        },
        {
            username: 'mika',
            email: 'mika@pma.local',
            password: 'demo12345',
            firstName: 'Mika',
            lastName: 'Winter',
            displayName: 'Mika',
            birthDate: '2000-12-02',
            gender: 'other',
            location: 'Amberg',
            bio: 'Zwischen Uni, Filmabenden und absurd kompetitiven Mario-Kart-Runden.',
            interests: ['Filme', 'Gaming', 'Karaoke'],
            vibeTags: ['Cozy', 'Competitive', 'Loud Laugh'],
            languages: ['Deutsch', 'Englisch'],
            icebreaker: 'Was ist dein most defendable Trash-Film?',
            jobTitle: 'Student',
            education: 'OTH Amberg-Weiden',
            lookingFor: 'Lockere Treffen, Filmabende und coole Leute',
            hometown: 'Amberg',
            favoriteHangout: 'Sofa-Ecke mit Snacks',
            weekendMood: 'Erst entspannt, spaeter laut',
            idealSunday: 'Film, Essen bestellen, random Karaoke',
            greenFlags: 'Nicht peinlich beruehrt bei Albernheit',
            funFact: 'Ich kenne zu viele schlechte 2000er-Komödien.',
            pictures: [avatarDataUrl('Mika', '#A855F7', '#3B82F6')],
        },
        {
            username: 'sora',
            email: 'sora@pma.local',
            password: 'demo12345',
            firstName: 'Sara',
            lastName: 'Noor',
            displayName: 'Sora',
            birthDate: '1998-06-27',
            gender: 'female',
            location: 'Amberg',
            bio: 'Mag Brunch, gute Gespraeche und Menschen, die nicht todesernst sind.',
            interests: ['Brunch', 'Podcasts', 'Spaziergaenge'],
            vibeTags: ['Warm', 'Thoughtful', 'Sunny'],
            languages: ['Deutsch', 'Arabisch', 'Englisch'],
            icebreaker: 'Wenn wir uns treffen: Kaffee, Aperol oder Mate?',
            jobTitle: 'Marketing',
            education: 'Uni Passau',
            lookingFor: 'Echte Dates statt endloses Rumgeschreibe',
            hometown: 'Amberg',
            favoriteHangout: 'Cafe mit Terrasse',
            weekendMood: 'Brunch first, Plan later',
            idealSunday: 'Brunch, Podcast, bisschen draussen sein',
            greenFlags: 'Verbindlich, warm, kein peinliches Alpha-Getue',
            funFact: 'Ich bewerte Orte insgeheim nach ihrem Chai.',
            pictures: [avatarDataUrl('Sora', '#F43F5E', '#FB7185')],
        },
        {
            username: 'byte',
            email: 'byte@pma.local',
            password: 'demo12345',
            firstName: 'Timo',
            lastName: 'Kurz',
            displayName: 'Byte',
            birthDate: '1999-01-15',
            gender: 'male',
            location: 'Regensburg',
            bio: 'Hackathons, dumme Sideprojects und gute Pommes.',
            interests: ['Coding', 'Startups', 'Pommes'],
            vibeTags: ['Builder', 'Fast Talker', 'Memey'],
            languages: ['Deutsch', 'Englisch'],
            icebreaker: 'Ich judge Tabs im Browser nicht. Meistens.',
            jobTitle: 'Software Developer',
            education: 'TH Ingolstadt',
            lookingFor: 'Leute, die fuer dumme Ideen zu haben sind',
            hometown: 'Regensburg',
            favoriteHangout: 'Pommesbude oder Laptop im Cafe',
            weekendMood: 'Sideproject oder spontan weg',
            idealSunday: 'Bisschen bauen, bisschen raus, bisschen Quatsch',
            greenFlags: 'Neugierig und nicht ueberheblich',
            funFact: 'Ich habe mal ein Tool fuer zu viele Tabs gebaut.',
            pictures: [avatarDataUrl('Byte', '#22C55E', '#06B6D4')],
        },
    ];

    for (const seed of userSeeds) {
        const user = await createUser(seed);
        users[seed.username] = user;
        sessions[seed.username] = await createSession(user);
    }

    await Swipe.insertMany([
        { swiperUserId: users.neo._id, targetUserId: users.trinity._id, direction: 'like' },
        { swiperUserId: users.trinity._id, targetUserId: users.neo._id, direction: 'like' },
        { swiperUserId: users.neo._id, targetUserId: users.switch._id, direction: 'like' },
        { swiperUserId: users.switch._id, targetUserId: users.neo._id, direction: 'like' },
        { swiperUserId: users.neo._id, targetUserId: users.morpheus._id, direction: 'pass' },
        { swiperUserId: users.trinity._id, targetUserId: users.switch._id, direction: 'like' },
    ]);

    const neoTrinityConversationKey = conversationKey(users.neo._id, users.trinity._id);
    const neoSwitchConversationKey = conversationKey(users.neo._id, users.switch._id);

    await Message.insertMany([
        {
            conversationKey: neoTrinityConversationKey,
            senderUserId: users.neo._id,
            recipientUserId: users.trinity._id,
            text: 'Hey, Lust auf das Kneipenquiz nächste Woche?',
        },
        {
            conversationKey: neoTrinityConversationKey,
            senderUserId: users.trinity._id,
            recipientUserId: users.neo._id,
            text: 'Klar, solange wir nicht Letzter werden.',
        },
        {
            conversationKey: neoSwitchConversationKey,
            senderUserId: users.switch._id,
            recipientUserId: users.neo._id,
            text: 'Ich hab gesehen, du magst Memes. Das klingt gefährlich kompatibel.',
        },
    ]);

    await Event.insertMany([
        {
            title: 'Kneipenquiz im Murphy\'s',
            description: 'Ein lockerer Quizabend in Amberg. Teams koennen spontan vor Ort gebildet werden.',
            date: '2026-07-15',
            time: '19:30',
            locationName: 'Murphy\'s Law Amberg',
            category: 'Quiz',
            position: [49.4447, 11.8512],
            creatorUserId: users.neo._id,
        },
        {
            title: 'After-Work Drinks',
            description: 'Nach Feierabend zusammenkommen, etwas trinken und neue Leute kennenlernen.',
            date: '2026-07-17',
            time: '20:00',
            locationName: 'Blaue Lilie',
            category: 'Treffen',
            position: [49.4429, 11.8494],
            creatorUserId: users.trinity._id,
        },
        {
            title: 'Park-Picknick & Spiele',
            description: 'Entspanntes Treffen im Park mit Snacks, Gesprächen und einer kleinen Spielrunde.',
            date: '2026-07-19',
            time: '16:00',
            locationName: 'Kurfuerstenbad Park',
            category: 'Sonstiges',
            position: [49.4462, 11.8458],
            creatorUserId: users.switch._id,
        },
    ]);

    console.log('PMA Demo-Daten erfolgreich erstellt.\n');
    console.log('Demo-Accounts:');
    for (const seed of userSeeds) {
        console.log(`- ${seed.username} / ${seed.password}`);
    }

    console.log('\nDemo-Tokens (optional fuer API-Tests):');
    for (const seed of userSeeds) {
        console.log(`- ${seed.username}: ${sessions[seed.username]}`);
    }
}

main()
    .catch((error) => {
        console.error('Fehler beim Seeding:', error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await disconnectDatabase();
    });
