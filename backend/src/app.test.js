const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = require('./app');
const placesService = require('./modules/places/places.service');
const { connectDatabase, disconnectDatabase, mongoose } = require('./db/mongoose');
const { User } = require('./modules/users/user.model');
const { Session } = require('./modules/auth/session.model');
const { Swipe } = require('./modules/matches/swipe.model');
const { Message } = require('./modules/chat/message.model');
const { Event } = require('./modules/events/event.model');

let mongoServer;

function request(server, path, method = 'GET', body, token) {
    return new Promise((resolve, reject) => {
        const address = server.address();
        const req = http.request(
            {
                hostname: '127.0.0.1',
                port: address.port,
                path,
                method,
                headers: {
                    'content-type': 'application/json',
                    ...(token ? { authorization: `Bearer ${token}` } : {}),
                },
            },
            (res) => {
                let body = '';
                res.setEncoding('utf8');
                res.on('data', (chunk) => {
                    body += chunk;
                });
                res.on('end', () => {
                    resolve({
                        statusCode: res.statusCode,
                        body: body ? JSON.parse(body) : null,
                    });
                });
            },
        );

        req.on('error', reject);
        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

test.before(async () => {
    mongoServer = await MongoMemoryServer.create();
    await connectDatabase(mongoServer.getUri());
});

test.after(async () => {
    await disconnectDatabase();
    if (mongoServer) {
        await mongoServer.stop();
    }
});

test.beforeEach(async () => {
    await User.deleteMany({});
    await Session.deleteMany({});
    await Swipe.deleteMany({});
    await Message.deleteMany({});
    await Event.deleteMany({});
});

test('GET /api/v1/health returns service status', async () => {
    const server = app.listen(0);

    try {
        const response = await request(server, '/api/v1/health');
        assert.equal(response.statusCode, 200);
        assert.equal(response.body.success, true);
        assert.equal(response.body.data.status, 'ok');
        assert.equal(response.body.data.database.readyState, mongoose.connection.readyState);
    } finally {
        await new Promise((resolve, reject) => {
            server.close((err) => (err ? reject(err) : resolve()));
        });
    }
});

test('unknown routes return a 404 payload', async () => {
    const server = app.listen(0);

    try {
        const response = await request(server, '/does-not-exist');
        assert.equal(response.statusCode, 404);
        assert.equal(response.body.success, false);
    } finally {
        await new Promise((resolve, reject) => {
            server.close((err) => (err ? reject(err) : resolve()));
        });
    }
});

test('register, fetch self and update profile/preferences', async () => {
    const server = app.listen(0);

    try {
        const registerResponse = await request(server, '/api/v1/auth/register', 'POST', {
            username: 'neo',
            email: 'neo@example.com',
            password: 'supersecret123',
            firstName: 'Neo',
            lastName: 'Claw',
            gender: 'male',
            location: 'Berlin',
        });

        assert.equal(registerResponse.statusCode, 201);
        assert.equal(registerResponse.body.success, true);
        const token = registerResponse.body.data.token;
        assert.ok(token);

        const meResponse = await request(server, '/api/v1/users/me', 'GET', null, token);
        assert.equal(meResponse.statusCode, 200);
        assert.equal(meResponse.body.data.username, 'neo');
        assert.equal(meResponse.body.data.email, 'neo@example.com');

        const profileUpdateResponse = await request(
            server,
            '/api/v1/users/me',
            'PATCH',
            {
                bio: 'Ghost in the machine',
                location: 'Munich',
                hometown: 'Amberg',
                jobTitle: 'Student',
                education: 'OTH Amberg-Weiden',
                lookingFor: 'Neue Leute fuer spontane Unternehmungen',
                interests: ['Gaming', 'Kaffee'],
                vibeTags: ['Dry Humor', 'Night Owl'],
                languages: ['Deutsch', 'Englisch'],
                icebreaker: 'Mein perfekter Tag startet mit Kaffee.',
                favoriteHangout: 'Kleines Cafe mit Sofas',
                weekendMood: 'Erst Kaffee, dann Chaos',
                idealSunday: 'Brunch, Spaziergang, abends Film',
                greenFlags: 'Kann ueber sich selbst lachen',
                funFact: 'Ich habe zu viele Sideprojects offen',
                pictures: ['data:image/png;base64,abc123'],
            },
            token,
        );

        assert.equal(profileUpdateResponse.statusCode, 200);
        assert.equal(profileUpdateResponse.body.data.bio, 'Ghost in the machine');
        assert.equal(profileUpdateResponse.body.data.location, 'Munich');
        assert.equal(profileUpdateResponse.body.data.jobTitle, 'Student');
        assert.equal(profileUpdateResponse.body.data.lookingFor, 'Neue Leute fuer spontane Unternehmungen');
        assert.deepEqual(profileUpdateResponse.body.data.interests, ['Gaming', 'Kaffee']);
        assert.deepEqual(profileUpdateResponse.body.data.vibeTags, ['Dry Humor', 'Night Owl']);
        assert.deepEqual(profileUpdateResponse.body.data.languages, ['Deutsch', 'Englisch']);
        assert.equal(profileUpdateResponse.body.data.idealSunday, 'Brunch, Spaziergang, abends Film');
        assert.equal(profileUpdateResponse.body.data.pictures[0], 'data:image/png;base64,abc123');

        const preferencesUpdateResponse = await request(
            server,
            '/api/v1/users/me/preferences',
            'PATCH',
            { minAge: 21, maxAge: 35 },
            token,
        );

        assert.equal(preferencesUpdateResponse.statusCode, 200);
        assert.equal(preferencesUpdateResponse.body.data.preferences.minAge, 21);
        assert.equal(preferencesUpdateResponse.body.data.preferences.maxAge, 35);
    } finally {
        await new Promise((resolve, reject) => {
            server.close((err) => (err ? reject(err) : resolve()));
        });
    }
});

test('login fails with wrong password', async () => {
    const server = app.listen(0);

    try {
        await request(server, '/api/v1/auth/register', 'POST', {
            username: 'neo',
            email: 'neo@example.com',
            password: 'supersecret123',
            firstName: 'Neo',
        });

        const loginResponse = await request(server, '/api/v1/auth/login', 'POST', {
            username: 'neo',
            password: 'wrong-password',
        });

        assert.equal(loginResponse.statusCode, 401);
        assert.equal(loginResponse.body.success, false);
    } finally {
        await new Promise((resolve, reject) => {
            server.close((err) => (err ? reject(err) : resolve()));
        });
    }
});

test('login works with username and register rejects duplicate username', async () => {
    const server = app.listen(0);

    try {
        await request(server, '/api/v1/auth/register', 'POST', {
            username: 'neo',
            password: 'supersecret123',
            firstName: 'Neo',
        });

        const loginResponse = await request(server, '/api/v1/auth/login', 'POST', {
            username: 'neo',
            password: 'supersecret123',
        });

        assert.equal(loginResponse.statusCode, 200);
        assert.equal(loginResponse.body.data.user.username, 'neo');

        const duplicateRegisterResponse = await request(server, '/api/v1/auth/register', 'POST', {
            username: 'neo',
            password: 'supersecret123',
            firstName: 'Thomas',
        });

        assert.equal(duplicateRegisterResponse.statusCode, 409);
        assert.equal(duplicateRegisterResponse.body.success, false);
    } finally {
        await new Promise((resolve, reject) => {
            server.close((err) => (err ? reject(err) : resolve()));
        });
    }
});

test('discovery lists other users and like-like creates a match', async () => {
    const server = app.listen(0);

    try {
        const neoRegister = await request(server, '/api/v1/auth/register', 'POST', {
            username: 'neo',
            password: 'supersecret123',
            firstName: 'Neo',
        });
        const trinityRegister = await request(server, '/api/v1/auth/register', 'POST', {
            username: 'trinity',
            password: 'supersecret123',
            firstName: 'Trinity',
        });

        const neoToken = neoRegister.body.data.token;
        const trinityToken = trinityRegister.body.data.token;
        const trinityId = trinityRegister.body.data.user.id;
        const neoId = neoRegister.body.data.user.id;

        const discoveryResponse = await request(server, '/api/v1/discovery', 'GET', null, neoToken);
        assert.equal(discoveryResponse.statusCode, 200);
        assert.equal(discoveryResponse.body.data.length, 1);
        assert.equal(discoveryResponse.body.data[0].username, 'trinity');

        const neoSwipeResponse = await request(server, '/api/v1/matches/swipe', 'POST', {
            targetUserId: trinityId,
            direction: 'like',
        }, neoToken);
        assert.equal(neoSwipeResponse.statusCode, 200);
        assert.equal(neoSwipeResponse.body.data.isMatch, false);

        const trinitySwipeResponse = await request(server, '/api/v1/matches/swipe', 'POST', {
            targetUserId: neoId,
            direction: 'like',
        }, trinityToken);
        assert.equal(trinitySwipeResponse.statusCode, 200);
        assert.equal(trinitySwipeResponse.body.data.isMatch, true);

        const neoMatchesResponse = await request(server, '/api/v1/matches', 'GET', null, neoToken);
        assert.equal(neoMatchesResponse.statusCode, 200);
        assert.equal(neoMatchesResponse.body.data.length, 1);
        assert.equal(neoMatchesResponse.body.data[0].username, 'trinity');
    } finally {
        await new Promise((resolve, reject) => {
            server.close((err) => (err ? reject(err) : resolve()));
        });
    }
});

test('matched users can exchange chat messages', async () => {
    const server = app.listen(0);

    try {
        const neoRegister = await request(server, '/api/v1/auth/register', 'POST', {
            username: 'neo',
            password: 'supersecret123',
            firstName: 'Neo',
        });
        const trinityRegister = await request(server, '/api/v1/auth/register', 'POST', {
            username: 'trinity',
            password: 'supersecret123',
            firstName: 'Trinity',
        });

        const neoToken = neoRegister.body.data.token;
        const trinityToken = trinityRegister.body.data.token;
        const trinityId = trinityRegister.body.data.user.id;
        const neoId = neoRegister.body.data.user.id;

        await request(server, '/api/v1/matches/swipe', 'POST', {
            targetUserId: trinityId,
            direction: 'like',
        }, neoToken);
        await request(server, '/api/v1/matches/swipe', 'POST', {
            targetUserId: neoId,
            direction: 'like',
        }, trinityToken);

        const sendResponse = await request(server, `/api/v1/chat/${trinityId}/messages`, 'POST', {
            text: 'Hey Trinity',
        }, neoToken);
        assert.equal(sendResponse.statusCode, 201);
        assert.equal(sendResponse.body.data.text, 'Hey Trinity');

        const conversationResponse = await request(server, `/api/v1/chat/${trinityId}/messages`, 'GET', null, neoToken);
        assert.equal(conversationResponse.statusCode, 200);
        assert.equal(conversationResponse.body.data.messages.length, 1);
        assert.equal(conversationResponse.body.data.messages[0].text, 'Hey Trinity');

        const listResponse = await request(server, '/api/v1/chat/conversations', 'GET', null, neoToken);
        assert.equal(listResponse.statusCode, 200);
        assert.equal(listResponse.body.data.length, 1);
        assert.equal(listResponse.body.data[0].user.username, 'trinity');
    } finally {
        await new Promise((resolve, reject) => {
            server.close((err) => (err ? reject(err) : resolve()));
        });
    }
});

test('authenticated users can create and list events and map overview includes data', async () => {
    const server = app.listen(0);

    try {
        const neoRegister = await request(server, '/api/v1/auth/register', 'POST', {
            username: 'neo',
            password: 'supersecret123',
            firstName: 'Neo',
            birthDate: '1998-05-10',
        });
        const trinityRegister = await request(server, '/api/v1/auth/register', 'POST', {
            username: 'trinity',
            password: 'supersecret123',
            firstName: 'Trinity',
            birthDate: '1997-11-11',
        });

        const neoToken = neoRegister.body.data.token;

        const createEventResponse = await request(server, '/api/v1/events', 'POST', {
            title: 'Kneipenquiz im Murphy\'s',
            description: 'Ein lockerer Abend mit Quiz und Bier.',
            date: '2026-07-15',
            time: '19:30',
            locationName: 'Murphy\'s Law',
            category: 'Quiz',
        }, neoToken);

        assert.equal(createEventResponse.statusCode, 201);
        assert.equal(createEventResponse.body.data.title, 'Kneipenquiz im Murphy\'s');
        assert.equal(createEventResponse.body.data.creator.username, 'neo');
        assert.equal(createEventResponse.body.data.position.length, 2);

        const listEventsResponse = await request(server, '/api/v1/events', 'GET', null, neoToken);
        assert.equal(listEventsResponse.statusCode, 200);
        assert.equal(listEventsResponse.body.data.length, 1);

        const mapOverviewResponse = await request(server, '/api/v1/map/overview', 'GET', null, neoToken);
        assert.equal(mapOverviewResponse.statusCode, 200);
        assert.equal(Array.isArray(mapOverviewResponse.body.data.center), true);
        assert.equal(mapOverviewResponse.body.data.events.length, 1);
        assert.equal(mapOverviewResponse.body.data.users.length, 1);
        assert.equal(mapOverviewResponse.body.data.users[0].name, 'Trinity');
    } finally {
        await new Promise((resolve, reject) => {
            server.close((err) => (err ? reject(err) : resolve()));
        });
    }
});

test('events in the past are rejected', async () => {
    const server = app.listen(0);

    try {
        const registerResponse = await request(server, '/api/v1/auth/register', 'POST', {
            username: 'neo',
            password: 'supersecret123',
            firstName: 'Neo',
            birthDate: '1998-05-10',
        });

        const token = registerResponse.body.data.token;
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

        const createEventResponse = await request(server, '/api/v1/events', 'POST', {
            title: 'Zu spaet',
            description: 'Dieser Termin liegt in der Vergangenheit.',
            date: yesterday,
            time: '19:30',
            locationName: 'Murphy\'s Law',
            category: 'Quiz',
        }, token);

        assert.equal(createEventResponse.statusCode, 400);
        assert.equal(createEventResponse.body.message, 'Events duerfen nicht in der Vergangenheit liegen');
    } finally {
        await new Promise((resolve, reject) => {
            server.close((err) => (err ? reject(err) : resolve()));
        });
    }
});

test('place search maps nominatim results', async () => {
    const mockFetch = async () => ({
        ok: true,
        async json() {
            return [
                {
                    place_id: 123,
                    name: 'Murphy\'s Law',
                    display_name: 'Murphy\'s Law, Amberg, Bayern, Deutschland',
                    lat: '49.4447',
                    lon: '11.8512',
                },
            ];
        },
    });

    const results = await placesService.searchPlaces('Murphy', {}, mockFetch);
    assert.equal(results.length, 1);
    assert.equal(results[0].name, 'Murphy\'s Law');
    assert.equal(results[0].label, 'Murphy\'s Law, Amberg, Bayern, Deutschland');
    assert.deepEqual(results[0].position, [49.4447, 11.8512]);
});

test('city place search forwards city mode to nominatim', async () => {
    let capturedUrl = null;
    const mockFetch = async (url) => {
        capturedUrl = String(url);
        return {
            ok: true,
            async json() {
                return [];
            },
        };
    };

    await placesService.searchPlaces('Amberg', { mode: 'city' }, mockFetch);
    assert.equal(capturedUrl.includes('featuretype=city'), true);
});
