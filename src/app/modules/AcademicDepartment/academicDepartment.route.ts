import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicDepartmentControllers } from './academicDepartment.controller';
import { academicDepartmentValidation } from './academicDepartment.validation';
import { USER_ROLE } from '../user/user.constant';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
    '/create-academic-department',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(
        academicDepartmentValidation.createAcademicDepartmentValidationSchema,
    ),
    AcademicDepartmentControllers.createAcademicDepartment,
);

router.get(
    '/',
    auth(
        USER_ROLE.superAdmin,
        USER_ROLE.admin,
        USER_ROLE.faculty,
        USER_ROLE.student,
    ),
    AcademicDepartmentControllers.getAllAcademicDepartment,
);

router.get(
    '/:departmentId',
    auth(
        USER_ROLE.superAdmin,
        USER_ROLE.admin,
        USER_ROLE.faculty,
        USER_ROLE.student,
    ),
    AcademicDepartmentControllers.getAcademicDepartmentById,
);

router.patch(
    '/:departmentId',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(
        academicDepartmentValidation.updateAcademicDepartmentValidationSchema,
    ),
    AcademicDepartmentControllers.updateAcademicDepartmentById,
);

export const AcademicDepartmentRoutes = router;
