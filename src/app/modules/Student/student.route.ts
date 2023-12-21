import express from 'express';
import { StudentController } from './student.controller';
import validateRequest from '../../middlewares/validateRequest';
import { studentValidations } from './student.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.patch(
    '/:id',
    validateRequest(studentValidations.updateStudentValidationSchema),
    StudentController.updateStudent,
);
router.get(
    '/', 
    auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student), 
    StudentController.getAllStudents
);
router.get('/:id', StudentController.getStudentByID);
router.delete('/:id', StudentController.deleteStudent);

export const StudentRoutes = router;
