import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { authValidation } from './auth.validation';
import { AuthControllers } from './auth.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
    '/login',
    validateRequest(authValidation.loginValidationSchema),
    AuthControllers.loginUser,
);

router.post(
    '/change-password',
    auth(
        USER_ROLE.superAdmin,
        USER_ROLE.admin,
        USER_ROLE.faculty,
        USER_ROLE.student,
    ),
    validateRequest(authValidation.changePasswordValidationSchema),
    AuthControllers.changePassword,
);

router.post(
    '/refresh-token',
    validateRequest(authValidation.refreshTokenValidationSchema),
    AuthControllers.refreshToken,
);

router.post(
    '/forget-password',
    validateRequest(authValidation.forgetPasswordValidationSchema),
    AuthControllers.forgetPassword,
);

router.post(
    '/reset-password',
    validateRequest(authValidation.resetPasswordValidationSchema),
    AuthControllers.resetPassword,
);

export const AuthRoutes = router;
