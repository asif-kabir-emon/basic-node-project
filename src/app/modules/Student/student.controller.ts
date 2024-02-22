import { StudentService } from './student.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const getAllStudents = catchAsync(async (req, res) => {
    const result = await StudentService.getStudentAllDB(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Student are retrieved successfully',
        meta: result.meta,
        data: result.result,
    });
});

const getStudentByID = catchAsync(async (req, res) => {
    const id = req.params.id;
    const result = await StudentService.getStudentByIdDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Student is retrieved successfully',
        data: result,
    });
});

const deleteStudent = catchAsync(async (req, res) => {
    const id = req.params.id;
    const result = await StudentService.deleteStudentFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Student is deleted successfully',
        data: result,
    });
});

const updateStudent = catchAsync(async (req, res) => {
    const id = req.params.id;
    const studentData = req.body.student;
    const result = await StudentService.updateStudentFromDB(id, studentData);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Student is updated successfully',
        data: result,
    });
});

export const StudentController = {
    getAllStudents,
    getStudentByID,
    deleteStudent,
    updateStudent,
};
