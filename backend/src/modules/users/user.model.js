const { mongoose } = require('../../db/mongoose');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            minlength: 3,
        },
        email: {
            type: String,
            lowercase: true,
            trim: true,
            default: null,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            default: '',
            trim: true,
        },
        bio: {
            type: String,
            default: '',
            trim: true,
        },
        birthDate: {
            type: String,
            default: null,
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'diverse', 'other', 'prefer_not_to_say'],
            default: 'prefer_not_to_say',
        },
        location: {
            type: String,
            default: '',
            trim: true,
        },
        displayName: {
            type: String,
            default: '',
            trim: true,
        },
        interests: {
            type: [String],
            default: [],
        },
        languages: {
            type: [String],
            default: [],
        },
        icebreaker: {
            type: String,
            default: '',
            trim: true,
        },
        pictures: {
            type: [String],
            default: [],
        },
        meetupStatus: {
            type: String,
            enum: ['active', 'paused', 'hidden'],
            default: 'active',
        },
        preferences: {
            minAge: {
                type: Number,
                default: 18,
            },
            maxAge: {
                type: Number,
                default: 99,
            },
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = { User };
