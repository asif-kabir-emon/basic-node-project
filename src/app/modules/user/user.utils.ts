import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { Student } from '../student/student.model';

const findLastStudentId = async (admissionSemester: string) => {
    const lastStudent = await Student.findOne({ role: 'student', admissionSemester: admissionSemester}, { id: 1, _id: 0 })
    .sort({id: -1}).lean();

    return lastStudent?.id ? lastStudent.id : undefined;
};


const generateStudentId = async ( payload: TAcademicSemester ) => {
    let currentId = (0).toString();

    const currentSemesterCode = payload.code;
    const currentSemesterYear = payload.year;

    const lastStudentId = await findLastStudentId(payload._id);
    if(lastStudentId) {
        const lastStudentYear = lastStudentId.substring(0, 4);
        const lastStudentSemesterCode = lastStudentId.substring(4, 6);

        if(lastStudentSemesterCode === currentSemesterCode && lastStudentYear === currentSemesterYear) {
            currentId = lastStudentId.substring(6);
        }
    }

    let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
    incrementId = `${payload.year}${payload.code}${incrementId}`;
    // console.log(incrementId);

    return incrementId;
};

export const UserUtils = {
    generateStudentId,
};