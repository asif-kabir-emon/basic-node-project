import { Request, Response } from "express";
import { StudentService } from "./student.service";

const createStudent = async (req: Request, res: Response) => {
    try {
        const { student: studentData } = req.body;
        const result = await StudentService.createStudentDB(studentData);
        res.status(200).send({
            success: true,
            message: "Student created successfully",
            data: result,
        });
    } catch (error) {
        console.log(error);
    }
};


const getAllStudents = async (req: Request, res: Response) => {
    try {
        const result = await StudentService.getStudentAllDB();
        res.status(200).send({
            success: true,
            message: "Student fetched successfully",
            data: result,
        });
    } catch (error) {
        console.log(error);
    }
};


const getStudentByID = async (req: Request, res: Response) => {
    try {
        const studentId = req.params.id;
        const result = await StudentService.getStudentByIdDB(studentId);
        res.status(200).send({
            success: true,
            message: "Student fetched successfully",
            data: result,
        });
    } catch (error) {
        console.log(error);
    }
};




export const StudentController = {
    createStudent,
    getAllStudents,
    getStudentByID,
};

