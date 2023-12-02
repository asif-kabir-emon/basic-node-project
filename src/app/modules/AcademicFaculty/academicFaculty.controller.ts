import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { AcademicFacultyServices } from "./academicFaculty.service";

const createAcademicFaculty = catchAsync(async (req, res) => {
    const result = await AcademicFacultyServices.createAcademicFacultyIntoDB(req.body);
    res.status(httpStatus.OK).send({
        success: true,
        message: 'Academic Faculty created successfully',
        data: result,
    });
})

export const AcademicFacultyControllers = {
    createAcademicFaculty,
}