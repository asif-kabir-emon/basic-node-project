import { Student } from './student.model';
// import { TStudent } from './student.interface';

const getStudentAllDB = async () => {
    const result = await Student.find().populate('admissionSemester')
                    .populate({
                        path: "academicDepartment",
                        populate: "academicFaculty",
                    });
    return result;
};

const getStudentByIdDB = async (id: string) => {
    const request = await Student.findById(id).populate('admissionSemester')
                    .populate({
                        path: "academicDepartment",
                        populate: "academicFaculty",
                    });;
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
