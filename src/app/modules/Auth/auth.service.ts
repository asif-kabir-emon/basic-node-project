import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import bcrypt from 'bcrypt';
import { createToke } from './auth.utils';
import { sendEmail } from '../../utils/sendEmail';

const loginUser = async (payload: TLoginUser) => {
    const user = await User.isUserExistByCustomId(payload.id);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    const isUserDeleted = user.isDeleted;

    if (isUserDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted');
    }

    const userStatus = user.status;

    if (userStatus === 'blocked') {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked');
    }

    if (!(await User.isPasswordMatched(payload.password, user.password))) {
        throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched!');
    }

    const jwtPayload = {
        userId: user.id,
        role: user.role,
    };

    const accessToken = createToke(
        jwtPayload,
        config.jwt_access_token as string,
        config.jwt_access_expired_in as string,
    );
    const refreshToken = createToke(
        jwtPayload,
        config.jwt_refresh_token as string,
        config.jwt_refresh_expired_in as string,
    );

    return {
        accessToken,
        refreshToken,
        needPasswordChange: user.needPasswordChange,
    };
};

const changePassword = async (
    userData: JwtPayload,
    payload: { oldPassword: string; newPassword: string },
) => {
    const user = await User.isUserExistByCustomId(userData.userId);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    const isUserDeleted = user.isDeleted;

    if (isUserDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted');
    }

    const userStatus = user.status;

    if (userStatus === 'blocked') {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked');
    }

    if (!(await User.isPasswordMatched(payload.oldPassword, user.password))) {
        throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched!');
    }

    const newHashedPassword = await bcrypt.hash(
        payload.newPassword,
        Number(config.bcrypt_salt_rounds),
    );

    await User.findOneAndUpdate(
        {
            id: userData.userId,
            role: userData.role,
        },
        {
            password: newHashedPassword,
            needPasswordChange: false,
            passwordChangeAt: new Date(),
        },
    );

    // return null;
};

const refreshToken = async (token: string) => {
    const decoded = jwt.verify(
        token,
        config.jwt_refresh_token as string,
    ) as JwtPayload;
    const { userId, iat } = decoded;

    const user = await User.isUserExistByCustomId(userId);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    const isUserDeleted = user.isDeleted;
    if (isUserDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted');
    }

    const userStatus = user.status;
    if (userStatus === 'blocked') {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked');
    }

    if (
        user.passwordChangeAt &&
        (await User.isJWTIssuedBeforePasswordChange(
            user.passwordChangeAt,
            iat as number,
        ))
    ) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    const jwtPayload = {
        userId: user.id,
        role: user.role,
    };

    const accessToken = createToke(
        jwtPayload,
        config.jwt_access_token as string,
        config.jwt_access_expired_in as string,
    );

    return {
        accessToken,
    };
};

const forgetPassword = async (id: string) => {
    const user = await User.isUserExistByCustomId(id);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    const isUserDeleted = user.isDeleted;
    if (isUserDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted');
    }

    const userStatus = user.status;
    if (userStatus === 'blocked') {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked');
    }

    const jwtPayload = {
        userId: user.id,
        role: user.role,
    };

    const resetToken = createToke(
        jwtPayload,
        config.jwt_access_token as string,
        '10m',
    );

    const resetUILink = `${config.reset_password_ui_link}?id=${user.id}&token=${resetToken}`;
    console.log(resetUILink);

    sendEmail(user.email, resetUILink);
    // return null;
};

const resetPassword = async (
    payload: { id: string; newPassword: string },
    token: string,
) => {
    const user = await User.isUserExistByCustomId(payload.id);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    const isUserDeleted = user.isDeleted;
    if (isUserDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted');
    }

    const userStatus = user.status;
    if (userStatus === 'blocked') {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked');
    }

    const decoded = jwt.verify(
        token,
        config.jwt_access_token as string,
    ) as JwtPayload;

    if (payload.id !== decoded.userId) {
        throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden');
    }

    const newHashedPassword = await bcrypt.hash(
        payload.newPassword,
        Number(config.bcrypt_salt_rounds),
    );

    await User.findOneAndUpdate(
        {
            id: decoded.userId,
            role: decoded.role,
        },
        {
            password: newHashedPassword,
            passwordChangeAt: new Date(),
        },
    );

    // return null;
};

export const AuthServices = {
    loginUser,
    changePassword,
    refreshToken,
    forgetPassword,
    resetPassword,
};
