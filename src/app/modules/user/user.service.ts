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
    
    const session = await mongoose.startSession();
    
    try {
        session.startTransaction();
        //set  generated id
        userData.id = await UserUtils.generateStudentId(findAcademicSemester as TAcademicSemester);

        // create a user
        const newUser = await User.create([userData], { session });

        //create a student
        if (!newUser.length) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
        }

        // set id , _id as user
        payload.id = newUser[0].id;
        payload.user = newUser[0]._id; 

        // create a student 
        const newStudent = await Student.create([payload], { session });

        if (!newStudent.length) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student');
        }

        await session.commitTransaction();
        await session.endSession();

        return newStudent;
  } catch (err) {
        console.log(err);
        await session.abortTransaction();
        await session.endSession();
        throw new Error('Failed to create student');
  }
};


export const UserServices = {
    createStudentIntoDB,
};