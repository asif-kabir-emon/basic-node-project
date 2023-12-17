import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { FacultyController } from './faculty.controller';
import { facultyValidations } from './faculty.validation';

const router = express.Router();

router.patch('/:id', validateRequest(facultyValidations.updateFacultyValidationSchema), FacultyController.updateFaculty);
router.get('/', FacultyController.getAllFaculties);
router.get('/:id', FacultyController.getFacultyByID);
router.delete('/:id', FacultyController.deleteFaculty);

export const FacultyRoutes = router;