import { RequestHandler } from 'express';
import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

const createStudent: RequestHandler = catchAsync(async (req, res) => {
    const { password, student: studentData } = req.body;

    const result = await UserServices.createStudentIntoDB(studentData, password); 

    sendResponse(res, {
        success: true,  
        statusCode: httpStatus.OK, 
        message: 'Student created successfully',
        data: result,
    })
});

export const UserController = { 
    createStudent,
};