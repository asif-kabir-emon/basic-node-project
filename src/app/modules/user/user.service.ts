import config from '../../config';
import { TStudent } from '../student/student.interface';
import { TUser } from './user.interface';
import { User } from './user.model';
import { Student } from '../student/student.model';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { UserUtils } from './user.utils';
import { TAcademicSemester } from '../academicSemester/academicSemester.interface';

const createStudentIntoDB = async (payload: TStudent, password: string) => {
    const userData : Partial<TUser> = {
        password: password || (config.default_password as string),
        role: 'student',
    };

    const findAcademicSemester = await AcademicSemester.findById(payload.admissionSemester);
    userData.id = await UserUtils.generateStudentId(findAcademicSemester as TAcademicSemester);

    // create user
    const newUser = await User.create(userData);

    // create student
    if(Object.keys(newUser).length > 0) {
        payload.id = newUser.id;
        payload.user = newUser._id;


        const newStudent = await Student.create(payload);

        return newStudent;
    }
};


export const UserServices = {
    createStudentIntoDB,
};