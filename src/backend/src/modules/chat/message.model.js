const { mongoose } = require('../../db/mongoose');

const messageSchema = new mongoose.Schema(
    {
        conversationKey: {
            type: String,
            required: true,
            index: true,
        },
        senderUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        recipientUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        text: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

messageSchema.index({ conversationKey: 1, createdAt: 1 });

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

module.exports = { Message };
