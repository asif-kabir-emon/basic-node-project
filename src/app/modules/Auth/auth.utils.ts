import jwt from 'jsonwebtoken';

export const createToke = (
    jwtPayload: { userId: string; role: string },
    secret: string,
    expiresIn: string,
) => {
    return jwt.sign(jwtPayload, secret, {
        expiresIn: expiresIn,
    });
};

export const verifyToken = (token: string, secret: string) => {
    const decoded = jwt.verify(token, secret);
    return decoded;
};
