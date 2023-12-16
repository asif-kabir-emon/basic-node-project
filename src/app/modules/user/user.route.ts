import express from "express";
import { UserController } from "./user.controller";
import { studentValidations } from "../student/student.validation";
import validateRequest from "../../middlewares/validateRequest";
import { facultyValidations } from "../Faculty/faculty.validation";
import { AdminValidations } from "../Admin/admin.validation";

const router = express.Router();

router.post(
    '/create-student',
    validateRequest(studentValidations.createStudentValidationSchema),
    UserController.createStudent,
  );
  
  router.post(
    '/create-faculty',
    validateRequest(facultyValidations.createFacultyValidationSchema),
    UserController.createFaculty,
  );
  
  router.post(
    '/create-admin',
    validateRequest(AdminValidations.createAdminValidationSchema),
    UserController.createAdmin,
  );

export const UserRoutes = router;