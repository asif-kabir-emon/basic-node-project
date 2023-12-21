import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';
import config from '../../config';

const loginUser = catchAsync(async (req, res) => {
    const result = await AuthServices.loginUser(req.body);
    const { refreshToken, accessToken, needPasswordChange } = result;

    res.cookie('RefreshToken', refreshToken, {
        secure: config.NODE_ENV == 'production',
        httpOnly: true,
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User is logged in successfully',
        data: {
            accessToken,
            needPasswordChange,
        },
    });
});

const changePassword = catchAsync(async (req, res) => {
    const { ...passwordData } = req.body;

    const result = await AuthServices.changePassword(req.user, passwordData);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Password is updated successfully!',
        data: result,
    });
});

const refreshToken = catchAsync(async (req, res) => {
    const { RefreshToken } = req.cookies;
    const result = await AuthServices.refreshToken(RefreshToken);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'New access token is created successfully!',
        data: result,
    });
});

const forgetPassword = catchAsync(async (req, res) => {
    const { id } = req.body;
    const result = await AuthServices.forgetPassword(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Forget password link is sent successfully!',
        data: result,
    });
});

const resetPassword = catchAsync(async (req, res) => {
    const token = req.headers.authorization as string;

    const result = await AuthServices.resetPassword(req.body, token);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Password reset successful !!',
        data: result,
    });
});

export const AuthControllers = {
    loginUser,
    changePassword,
    refreshToken,
    forgetPassword,
    resetPassword,
};
