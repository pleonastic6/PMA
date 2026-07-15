const { mongoose } = require('../../db/mongoose');

const eventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        date: {
            type: String,
            required: true,
            trim: true,
        },
        time: {
            type: String,
            required: true,
            trim: true,
        },
        locationName: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            default: 'Sonstiges',
            trim: true,
        },
        position: {
            type: [Number],
            default: [],
        },
        creatorUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

module.exports = { Event };
