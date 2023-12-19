import { Schema, model } from 'mongoose';
import { TUser } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';

const userSchema = new Schema<TUser>(
    {
        id: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        needPasswordChange: {
            type: Boolean,
            default: true,
        },
        role: {
            type: String,
            enum: ['admin', 'student', 'faculty'],
            required: true,
        },
        status: {
            type: String,
            enum: ['in-progress', 'blocked'],
            default: 'in-progress',
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

// Post save middleware hook
userSchema.post('save', function (doc, next) {
    doc.password = '';
    next();
});

// Pre save middleware hook
userSchema.pre('save', async function (next) {
    // hashing the password
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const user = this;
    user.password = await bcrypt.hash(
        user.password,
        Number(config.bcrypt_salt_rounds),
    );
    next();
});

// Post save middleware hook
userSchema.post('save', function (doc, next) {
    doc.password = '';
    next();
});

export const User = model<TUser>('User', userSchema);
