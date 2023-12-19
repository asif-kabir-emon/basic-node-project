import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { AcademicFacultyServices } from './academicFaculty.service';

const createAcademicFaculty = catchAsync(async (req, res) => {
    const result = await AcademicFacultyServices.createAcademicFacultyIntoDB(
        req.body,
    );
    res.status(httpStatus.OK).send({
        success: true,
        message: 'Academic Faculty created successfully',
        data: result,
    });
});

const getAllAcademicFaculty = catchAsync(async (req, res) => {
    const result = await AcademicFacultyServices.getAllAcademicFacultyFromDB();
    res.status(httpStatus.OK).send({
        success: true,
        message: 'Academic Faculties fetched successfully',
        data: result,
    });
});

const getAcademicFacultyById = catchAsync(async (req, res) => {
    const result = await AcademicFacultyServices.getAcademicFacultyByIdFromDB(
        req.params.facultyId,
    );
    res.status(httpStatus.OK).send({
        success: true,
        message: 'Academic Faculty fetched successfully',
        data: result,
    });
});

const updateAcademicFacultyById = catchAsync(async (req, res) => {
    const result = await AcademicFacultyServices.updateAcademicFacultyIntoDB(
        req.params.facultyId,
        req.body,
    );
    res.status(httpStatus.OK).send({
        success: true,
        message: 'Academic Faculty updated successfully',
        data: result,
    });
});

export const AcademicFacultyControllers = {
    createAcademicFaculty,
    getAllAcademicFaculty,
    getAcademicFacultyById,
    updateAcademicFacultyById,
};
