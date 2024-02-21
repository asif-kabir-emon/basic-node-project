import express from 'express';
import { AcademicFacultyControllers } from './academicFaculty.controller';
import validateRequest from '../../middlewares/validateRequest';
import { academicFacultyValidation } from './academicFaculty.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
    '/create-academic-faculty',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(
        academicFacultyValidation.createAcademicFacultyValidationSchema,
    ),
    AcademicFacultyControllers.createAcademicFaculty,
);

router.get(
    '/',
    auth(
        USER_ROLE.superAdmin,
        USER_ROLE.admin,
        USER_ROLE.faculty,
        USER_ROLE.student,
    ),
    AcademicFacultyControllers.getAllAcademicFaculty,
);

router.get(
    '/:facultyId',
    auth(
        USER_ROLE.superAdmin,
        USER_ROLE.admin,
        USER_ROLE.faculty,
        USER_ROLE.student,
    ),
    AcademicFacultyControllers.getAcademicFacultyById,
);

router.patch(
    '/:facultyId',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(
        academicFacultyValidation.updateAcademicFacultyValidationSchema,
    ),
    AcademicFacultyControllers.updateAcademicFacultyById,
);

export const AcademicFacultyRoutes = router;
