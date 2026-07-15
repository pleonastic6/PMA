const { mongoose } = require('../../db/mongoose');

const swipeSchema = new mongoose.Schema(
    {
        swiperUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        targetUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        direction: {
            type: String,
            enum: ['like', 'pass'],
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

swipeSchema.index({ swiperUserId: 1, targetUserId: 1 }, { unique: true });

const Swipe = mongoose.models.Swipe || mongoose.model('Swipe', swipeSchema);

module.exports = { Swipe };
