import { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';

const auth = (...requiredRoles: TUserRole[]) => {
    return catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            const token = req.headers?.authorization;

            if (!token) {
                throw new AppError(
                    httpStatus.UNAUTHORIZED,
                    'You are not authorized!',
                );
            }

            const decoded = jwt.verify(
                token,
                config.jwt_access_token as string,
            ) as JwtPayload;

            req.user = decoded;
            const { userId, role, iat } = decoded;

            const user = await User.isUserExistByCustomId(userId);

            if (!user) {
                throw new AppError(httpStatus.NOT_FOUND, 'User not found');
            }

            const isUserDeleted = user.isDeleted;

            if (isUserDeleted) {
                throw new AppError(
                    httpStatus.FORBIDDEN,
                    'This user is deleted',
                );
            }

            const userStatus = user.status;

            if (userStatus === 'blocked') {
                throw new AppError(
                    httpStatus.FORBIDDEN,
                    'This user is blocked',
                );
            }

            if (
                user.passwordChangeAt &&
                (await User.isJWTIssuedBeforePasswordChange(
                    user.passwordChangeAt,
                    iat as number,
                ))
            ) {
                throw new AppError(
                    httpStatus.UNAUTHORIZED,
                    'You are not authorized!',
                );
            }

            if (requiredRoles && !requiredRoles.includes(role)) {
                throw new AppError(
                    httpStatus.UNAUTHORIZED,
                    'You are not authorized!',
                );
            }

            next();
        },
    );
};

export default auth;
