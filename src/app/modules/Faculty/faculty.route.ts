import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { FacultyController } from './faculty.controller';
import { facultyValidations } from './faculty.validation';

const router = express.Router();

router.patch('/:studentId', validateRequest(facultyValidations.updateFacultyValidationSchema), FacultyController.updateFaculty);
router.get('/', FacultyController.getAllFaculties);
router.get('/:studentId', FacultyController.getFacultyByID);
router.delete('/:studentId', FacultyController.deleteFaculty);

export const FacultyRoutes = router;