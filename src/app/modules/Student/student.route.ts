import express from 'express';
import { StudentController } from './student.controller';
import validateRequest from '../../middlewares/validateRequest';
import { studentValidations } from './student.validation';

const router = express.Router();

router.patch('/:id', validateRequest(studentValidations.updateStudentValidationSchema), StudentController.updateStudent);
router.get('/', StudentController.getAllStudents);
router.get('/:id', StudentController.getStudentByID);
router.delete('/:id', StudentController.deleteStudent);

export const StudentRoutes = router;
