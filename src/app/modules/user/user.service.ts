import config from '../../config';
import { TStudent } from '../student/student.interface';
import { TUser } from './user.interface';
import { User } from './user.model';
import { Student } from '../student/student.model';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { UserUtils } from './user.utils';
import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createStudentIntoDB = async (payload: TStudent, password: string) => {
    const userData : Partial<TUser> = {
        password: password || (config.default_password as string),
        role: 'student',
    };

    const findAcademicSemester = await AcademicSemester.findById(payload.admissionSemester);
    userData.id = await UserUtils.generateStudentId(findAcademicSemester as TAcademicSemester);

    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        // create user 
        const newUser = await User.create([userData], { session });

        // create student
        if(!newUser.length) {
            throw new AppError(httpStatus.BAD_REQUEST, "Failed to create user");
        }

        payload.id = newUser[0].id;
        payload.user = newUser[0]._id;

        const newStudent = await Student.create([payload], { session });
        if(!newStudent.length) {
            throw new AppError(httpStatus.BAD_REQUEST, "Failed to create student");
        }

        await session.commitTransaction();
        await session.endSession();

        return newStudent;
    } catch (error) {
        console.log(error);
        session.abortTransaction();
        session.endSession();
        throw new AppError(httpStatus.BAD_REQUEST, "Failed to create");
    }
};


export const UserServices = {
    createStudentIntoDB,
};