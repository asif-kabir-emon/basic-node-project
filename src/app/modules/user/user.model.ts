import { Schema, model } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';

const userSchema = new Schema<TUser, UserModel>(
    {
        id: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            select: 0,
        },
        needPasswordChange: {
            type: Boolean,
            default: true,
        },
        passwordChangeAt: {
            type: Date,
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

userSchema.statics.isUserExistByCustomId = async function (id: string) {
    return await User.findOne({ id: id }).select('+password');
}

userSchema.statics.isPasswordMatched = async function (plainTextPassword: string, hashedPassword: string) {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
}

userSchema.statics.isJWTIssuedBeforePasswordChange = async function (passwordChangeTimeStamp: Date, jwtIssuedTimeStamp: number) {
    const passwordChangedTime = new Date(passwordChangeTimeStamp).getTime()/1000;

    return passwordChangedTime > jwtIssuedTimeStamp
}

export const User = model<TUser, UserModel>('User', userSchema);
