/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { StudentService } from './student.service';
import { ValidationSchema } from './student.validation';

const createStudent = async (req: Request, res: Response) => {
    try {
        const { student: studentData } = req.body;
        const parseData =
            ValidationSchema.StudentValidationSchema.parse(studentData);

        const result = await StudentService.createStudentDB(parseData); 

        res.status(200).send({
            success: true,
            message: 'Student created successfully',
            data: result,
        });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        res.status(500).send({
            success: false,
            message: error.message || 'Something went wrong',
            error: error,
        });
    }
};

const getAllStudents = async (req: Request, res: Response) => {
    try {
        const result = await StudentService.getStudentAllDB();
        res.status(200).send({
            success: true,
            message: 'Student fetched successfully',
            data: result,
        });
    } catch (error: any) {
        res.status(500).send({
            success: false,
            message: error.message || 'Something went wrong',
            error: error,
        });
    }
};

const getStudentByID = async (req: Request, res: Response) => {
    try {
        const studentId = req.params.id;
        const result = await StudentService.getStudentByIdDB(studentId);
        res.status(200).send({
            success: true,
            message: 'Student fetched successfully',
            data: result,
        });
    } catch (error: any) {
        res.status(500).send({
            success: false,
            message: error.message || 'Something went wrong',
            error: error,
        });
    }
};

const deleteStudent = async (req: Request, res: Response) => {
    try {
        const studentId = req.params.id;
        const result = await StudentService.deleteStudentFromDB(studentId);
        res.status(200).send({
            success: true,
            message: 'Student deleted successfully',
            data: result,
        });
    } catch (error: any) {
        res.status(500).send({
            success: false,
            message: error.message || 'Something went wrong',
            error: error,
        });
    }
};

export const StudentController = {
    createStudent,
    getAllStudents,
    getStudentByID,
    deleteStudent,
};
