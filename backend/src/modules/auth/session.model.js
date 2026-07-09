const { mongoose } = require('../../db/mongoose');

const sessionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        token: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

const Session = mongoose.models.Session || mongoose.model('Session', sessionSchema);

module.exports = { Session };
