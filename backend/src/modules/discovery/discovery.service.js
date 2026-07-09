const { User } = require('../users/user.model');
const { Swipe } = require('../matches/swipe.model');
const { publicUser } = require('../auth/auth.service');
const { calculateAge } = require('../../common/utils/profile');

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

async function listCandidates(currentUserId) {
    const currentUser = await User.findById(currentUserId).lean();
    const swipes = await Swipe.find({ swiperUserId: currentUserId }).lean();
    const excludedIds = swipes.map((swipe) => String(swipe.targetUserId));
    excludedIds.push(String(currentUserId));

    const candidates = await User.find({
        _id: { $nin: excludedIds },
        meetupStatus: 'active',
    })
        .sort({ createdAt: -1 })
        .limit(25);

    return candidates
        .filter((candidate) => matchesAgePreferences(candidate, currentUser))
        .map(publicUser);
}

module.exports = {
    listCandidates,
};
