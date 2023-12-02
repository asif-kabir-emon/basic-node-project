import { Student } from './student.model';
// import { TStudent } from './student.interface';

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
    getStudentAllDB,
    getStudentByIdDB,
    deleteStudentFromDB,
};
