import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { AcademicDepartmentServices } from './academicDepartment.service';

const createAcademicDepartment = catchAsync(async (req, res) => {
    const result =
        await AcademicDepartmentServices.createAcademicDepartmentIntoDB(
            req.body,
        );
    res.status(httpStatus.OK).send({
        success: true,
        message: 'Academic Department is created successfully',
        data: result,
    });
});

const getAllAcademicDepartment = catchAsync(async (req, res) => {
    const result =
        await AcademicDepartmentServices.getAllAcademicDepartmentFromDB();
    res.status(httpStatus.OK).send({
        success: true,
        message: 'Academic Departments are retrieved successfully',
        data: result,
    });
});

const getAcademicDepartmentById = catchAsync(async (req, res) => {
    const result =
        await AcademicDepartmentServices.getAcademicDepartmentByIdFromDB(
            req.params.departmentId,
        );
    res.status(httpStatus.OK).send({
        success: true,
        message: 'Academic Department is retrieved successfully',
        data: result,
    });
});

const updateAcademicDepartmentById = catchAsync(async (req, res) => {
    const result =
        await AcademicDepartmentServices.updateAcademicDepartmentIntoDB(
            req.params.departmentId,
            req.body,
        );
    res.status(httpStatus.OK).send({
        success: true,
        message: 'Academic Department is updated successfully',
        data: result,
    });
});

export const AcademicDepartmentControllers = {
    createAcademicDepartment,
    getAllAcademicDepartment,
    getAcademicDepartmentById,
    updateAcademicDepartmentById,
};
