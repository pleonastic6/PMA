const { asyncHandler } = require('../../common/utils/async-handler');
const { AppError } = require('../../common/errors/app-error');
const chatService = require('./chat.service');

const listConversations = asyncHandler(async (req, res) => {
    const conversations = await chatService.listConversations(req.auth.user._id);

    res.status(200).json({
        success: true,
        data: conversations,
    });
});

const listMessages = asyncHandler(async (req, res) => {
    const otherUserId = req.params.userId;
    if (!otherUserId) {
        throw new AppError(400, 'userId ist erforderlich');
    }

    const conversation = await chatService.listMessages(req.auth.user._id, otherUserId);
    res.status(200).json({
        success: true,
        data: conversation,
    });
});

const sendMessage = asyncHandler(async (req, res) => {
    const otherUserId = req.params.userId;
    const text = req.body?.text;

    if (!otherUserId) {
        throw new AppError(400, 'userId ist erforderlich');
    }

    const message = await chatService.sendMessage(req.auth.user._id, otherUserId, text);
    res.status(201).json({
        success: true,
        data: message,
    });
});

const deleteConversation = asyncHandler(async (req, res) => {
    const otherUserId = req.params.userId;

    if (!otherUserId) {
        throw new AppError(400, 'userId ist erforderlich');
    }

    await chatService.deleteConversation(req.auth.user._id, otherUserId);
    res.status(200).json({
        success: true,
        data: { userId: otherUserId },
    });
});

module.exports = {
    listConversations,
    listMessages,
    sendMessage,
    deleteConversation,
};
