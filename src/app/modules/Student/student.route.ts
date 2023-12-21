import express from 'express';
import { StudentController } from './student.controller';
import validateRequest from '../../middlewares/validateRequest';
import { studentValidations } from './student.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.patch(
    '/:id',
    auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    validateRequest(studentValidations.updateStudentValidationSchema),
    StudentController.updateStudent,
);
router.get(
    '/',
    auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    StudentController.getAllStudents,
);
router.get(
    '/:id',
    auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    StudentController.getStudentByID,
);
router.delete('/:id', auth(USER_ROLE.admin), StudentController.deleteStudent);

export const StudentRoutes = router;
