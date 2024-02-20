import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicDepartmentControllers } from './academicDepartment.controller';
import { academicDepartmentValidation } from './academicDepartment.validation';
import { USER_ROLE } from '../user/user.constant';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
    '/create-academic-department',
    auth(USER_ROLE.superAdmin),
    validateRequest(
        academicDepartmentValidation.createAcademicDepartmentValidationSchema,
    ),
    AcademicDepartmentControllers.createAcademicDepartment,
);
router.get('/', AcademicDepartmentControllers.getAllAcademicDepartment);
router.get(
    '/:departmentId',
    AcademicDepartmentControllers.getAcademicDepartmentById,
);
router.patch(
    '/:departmentId',
    validateRequest(
        academicDepartmentValidation.updateAcademicDepartmentValidationSchema,
    ),
    AcademicDepartmentControllers.updateAcademicDepartmentById,
);

export const AcademicDepartmentRoutes = router;
