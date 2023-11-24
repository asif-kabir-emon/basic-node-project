import { Student } from './student.model';
import { TStudent } from './student.interface';

const createStudentDB = async (student: TStudent) => {
     // Build-in static method
    if(await Student.isUserExists(student.id)) {
        throw new Error('User already exists');
    }
    const result = await Student.create(student);

    // // Build-in instance method
    // const newStudent = new Student(student);

    // if(await newStudent.isUserExists(student.id)) {
    //     throw new Error('User already exists');
    // }

    // const result = await newStudent.save();
    return result;
};

const getStudentAllDB = async () => {
    const result = await Student.find();
    return result;
};

const getStudentByIdDB = async (id: string) => {
    // const request = await Student.findOne({ id: id });
    const request = await Student.aggregate([
        {
            $match: {
                id: id,
            },
        },
    ]);
    return request;
};

const deleteStudentFromDB = async (id: string) => {
    const request = await Student.updateOne({ id: id }, { isDeleted: true });
    return request;
};

export const StudentService = {
    createStudentDB,
    getStudentAllDB,
    getStudentByIdDB,
    deleteStudentFromDB,
};
