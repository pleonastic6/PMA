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
            languages: ['Deutsch', 'Englisch'],
            icebreaker: 'Ich finde meistens die beste Bar durch Trial and Error.',
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
            languages: ['Deutsch', 'Englisch'],
            icebreaker: 'Wenn du einen schlechten Wortwitz hast, raus damit.',
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
            languages: ['Deutsch'],
            icebreaker: 'Ich judge Leute nach ihrer Lieblings-Pommesbude.',
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
            languages: ['Deutsch', 'Englisch'],
            icebreaker: 'Welches Meme beschreibt deinen Tag bisher am besten?',
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
            languages: ['Deutsch', 'Englisch'],
            icebreaker: 'Zeig mir deinen most cursed Screenshot.',
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
            languages: ['Deutsch', 'Englisch'],
            icebreaker: 'Ich plane Trips schlecht, aber sie werden gut.',
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
            languages: ['Deutsch', 'Englisch'],
            icebreaker: 'Was ist dein most defendable Trash-Film?',
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
            languages: ['Deutsch', 'Arabisch', 'Englisch'],
            icebreaker: 'Wenn wir uns treffen: Kaffee, Aperol oder Mate?',
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
            languages: ['Deutsch', 'Englisch'],
            icebreaker: 'Ich judge Tabs im Browser nicht. Meistens.',
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
