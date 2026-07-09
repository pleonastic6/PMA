const { AppError } = require('../../common/errors/app-error');
const { Message } = require('./message.model');
const { User } = require('../users/user.model');
const { listMatches } = require('../matches/matches.service');
const { publicUser } = require('../auth/auth.service');

function buildConversationKey(userAId, userBId) {
    return [String(userAId), String(userBId)].sort().join(':');
}

async function requireMatch(currentUserId, otherUserId) {
    const matches = await listMatches(currentUserId);
    const isMatch = matches.some((match) => String(match.id) === String(otherUserId));

    if (!isMatch) {
        throw new AppError(403, 'Chat ist nur mit Matches erlaubt');
    }
}

async function listConversations(currentUserId) {
    const matches = await listMatches(currentUserId);
    const messages = await Message.find({
        $or: [{ senderUserId: currentUserId }, { recipientUserId: currentUserId }],
    })
        .sort({ createdAt: -1 })
        .lean();

    const latestByConversation = new Map();

    for (const message of messages) {
        if (!latestByConversation.has(message.conversationKey)) {
            latestByConversation.set(message.conversationKey, message);
        }
    }

    return matches.map((match) => {
        const conversationKey = buildConversationKey(currentUserId, match.id);
        const latestMessage = latestByConversation.get(conversationKey) || null;

        return {
            conversationKey,
            user: match,
            latestMessage: latestMessage
                ? {
                      id: String(latestMessage._id),
                      text: latestMessage.text,
                      senderUserId: String(latestMessage.senderUserId),
                      recipientUserId: String(latestMessage.recipientUserId),
                      createdAt: latestMessage.createdAt,
                  }
                : null,
        };
    });
}

async function listMessages(currentUserId, otherUserId) {
    await requireMatch(currentUserId, otherUserId);

    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
        throw new AppError(404, 'Match-Profil nicht gefunden');
    }

    const conversationKey = buildConversationKey(currentUserId, otherUserId);
    const messages = await Message.find({ conversationKey }).sort({ createdAt: 1 }).lean();

    return {
        conversationKey,
        user: publicUser(otherUser),
        messages: messages.map((message) => ({
            id: String(message._id),
            text: message.text,
            senderUserId: String(message.senderUserId),
            recipientUserId: String(message.recipientUserId),
            createdAt: message.createdAt,
        })),
    };
}

async function sendMessage(currentUserId, otherUserId, text) {
    await requireMatch(currentUserId, otherUserId);

    const recipient = await User.findById(otherUserId);
    if (!recipient) {
        throw new AppError(404, 'Empfänger nicht gefunden');
    }

    const trimmedText = String(text || '').trim();
    if (!trimmedText) {
        throw new AppError(400, 'Nachricht darf nicht leer sein');
    }

    const message = await Message.create({
        conversationKey: buildConversationKey(currentUserId, otherUserId),
        senderUserId: currentUserId,
        recipientUserId: otherUserId,
        text: trimmedText,
    });

    return {
        id: String(message._id),
        text: message.text,
        senderUserId: String(message.senderUserId),
        recipientUserId: String(message.recipientUserId),
        createdAt: message.createdAt,
    };
}

module.exports = {
    listConversations,
    listMessages,
    sendMessage,
};
