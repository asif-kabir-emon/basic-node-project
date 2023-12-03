import express from 'express';
import { StudentController } from './student.controller';
import validateRequest from '../../middlewares/validateRequest';
import { studentValidations } from './student.validation';

const router = express.Router();

router.patch('/:studentId', validateRequest(studentValidations.updateStudentValidationSchema), StudentController.updateStudent);
router.get('/', StudentController.getAllStudents);
router.get('/:studentId', StudentController.getStudentByID);
router.delete('/:studentId', StudentController.deleteStudent);

export const StudentRoutes = router;
