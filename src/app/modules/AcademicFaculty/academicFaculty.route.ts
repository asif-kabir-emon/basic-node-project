import express from "express";
import { AcademicFacultyControllers } from "./academicFaculty.controller";
import validateRequest from "../../middlewares/validateRequest";
import { academicFacultyValidation } from "./academicFaculty.validation";

const router = express.Router();

router.post('/create-academic-faculty', validateRequest(academicFacultyValidation.createAcademicFacultyValidationSchema), AcademicFacultyControllers.createAcademicFaculty);

export const AcademicFacultyRoutes = router;