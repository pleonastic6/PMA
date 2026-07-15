const crypto = require('node:crypto');

const SALT_LENGTH = 16;
const KEY_LENGTH = 64;
const DIGEST = 'sha512';

function scrypt(password, salt) {
    return new Promise((resolve, reject) => {
        crypto.scrypt(password, salt, KEY_LENGTH, { N: 16384 }, (err, derivedKey) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(derivedKey.toString('hex'));
        });
    });
}

async function hashPassword(password) {
    const salt = crypto.randomBytes(SALT_LENGTH).toString('hex');
    const hash = await scrypt(password, salt);
    return `${salt}:${hash}`;
}

async function verifyPassword(password, storedHash) {
    const [salt, expectedHash] = storedHash.split(':');

    if (!salt || !expectedHash) {
        return false;
    }

    const actualHash = await scrypt(password, salt);
    return crypto.timingSafeEqual(
        Buffer.from(actualHash, 'hex'),
        Buffer.from(expectedHash, 'hex'),
    );
}

module.exports = {
    hashPassword,
    verifyPassword,
};
