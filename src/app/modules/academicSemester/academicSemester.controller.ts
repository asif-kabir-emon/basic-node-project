import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { AcademicSemesterServices } from './academicSemester.service';

const createAcademicSemester = catchAsync(async (req, res) => {
    const result = await AcademicSemesterServices.CreateAcademicSemesterIntoDB(
        req.body,
    );
    res.status(httpStatus.OK).send({
        success: true,
        message: 'Academic Semester created successfully',
        data: result,
    });
});

const getAllAcademicSemester = catchAsync(async (req, res) => {
    const result = await AcademicSemesterServices.getAllAcademicSemesterFromDB(
        req.query,
    );
    res.status(httpStatus.OK).send({
        success: true,
        message: 'Academic Semester fetched successfully',
        meta: result.meta,
        data: result.result,
    });
});

const getAcademicSemesterById = catchAsync(async (req, res) => {
    const result = await AcademicSemesterServices.getAcademicSemesterByIdFromDB(
        req.params.id,
    );
    res.status(httpStatus.OK).send({
        success: true,
        message: 'Academic Semester fetched successfully',
        data: result,
    });
});

const updateAcademicSemesterById = catchAsync(async (req, res) => {
    const result =
        await AcademicSemesterServices.updateAcademicSemesterByIdFromDB(
            req.params.semesterId,
            req.body,
        );
    res.status(httpStatus.OK).send({
        success: true,
        message: 'Academic Semester updated successfully',
        data: result,
    });
});

export const AcademicSemesterControllers = {
    createAcademicSemester,
    getAllAcademicSemester,
    getAcademicSemesterById,
    updateAcademicSemesterById,
};
