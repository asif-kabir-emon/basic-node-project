import { StudentModel } from "./student.model";
import { Student } from "./student.interface";

const createStudentDB = async (student: Student) => {
    const result = await StudentModel.create(student);
    return result;
}

const getStudentAllDB = async () => {
    const result = await StudentModel.find();
    return result;
}

const getStudentByIdDB = async (id: string) => {
    const request = await StudentModel.findOne({ id: id });
    return request;
}

export const StudentService = { 
    createStudentDB,
    getStudentAllDB,
    getStudentByIdDB,
};