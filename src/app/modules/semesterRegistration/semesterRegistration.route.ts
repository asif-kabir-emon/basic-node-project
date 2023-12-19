import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationValidation } from './semesterRegistration.validation';
import { SemesterRegistrationControllers } from './semesterRegistration.controller';

const router = express.Router();

router.post(
    '/create-semester-registration',
    validateRequest(
        SemesterRegistrationValidation.createSemesterRegistrationValidation,
    ),
    SemesterRegistrationControllers.createSemesterRegistration,
);

router.get(
    '/:id',
    SemesterRegistrationControllers.getSingleSemesterRegistration,
);

router.patch(
    '/:id',
    validateRequest(
        SemesterRegistrationValidation.updateSemesterRegistrationValidation,
    ),
    SemesterRegistrationControllers.updateSemesterRegistration,
);

router.get('/', SemesterRegistrationControllers.getAllSemesterRegistration);

export const SemesterRegistrationRoutes = router;
