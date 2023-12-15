/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import { Student } from './student.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import { TStudent } from './student.interface';

const getStudentAllDB = async (query: Record<string,unknown>) => {
    // { email: { $regex : query.searchTerm, $options: i } }
    // { name.firstName: { $regex : query.searchTerm, $options: i } }

    let searchTerm = '';

    if(query?.searchTerm) {
        searchTerm = query?.searchTerm as string;
    }

    const result = await Student.find({
        $or: ['email', 'name.firstName', 'presentAddress'].map
        ((field) => ({
            [field]: { $regex : searchTerm, $options: 'i' },
        })),
    }).populate('admissionSemester')
                    .populate({
                        path: "academicDepartment",
                        populate: "academicFaculty",
                    });
    return result;
};

const getStudentByIdDB = async (id: string) => {
    const result = await Student.findOne({id}).populate('admissionSemester')
                    .populate({
                        path: "academicDepartment",
                        populate: "academicFaculty",
                    });;
    return result;
};

const deleteStudentFromDB = async (id: string) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        const deletedStudent = await Student.findOneAndUpdate({ id }, { isDeleted: true }, { new: true, session });

        if(!deletedStudent) {
            throw new AppError(httpStatus.BAD_REQUEST ,'Failed to delete student');
        }

        const deletedUser = await User.findOneAndUpdate({ id }, { isDeleted: true }, { new: true, session });

        if(!deletedUser) {
            throw new AppError(httpStatus.BAD_REQUEST ,'Failed to delete user');
        }

        await session.commitTransaction();
        await session.endSession();

        return deletedStudent;
    } catch (err: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error(err);
    }
};

const updateStudentFromDB = async (id: string, payload: Partial<TStudent>) => {
    const { name, guardian, localGuardian, ...remainingStudentData } = payload;

    const modifiedUpdatedData: Record<string, unknown> = {...remainingStudentData};

    if(name && Object.keys(name).length) {
        for(const [key, value] of Object.entries(name)) {
            modifiedUpdatedData[`name.${key}`] = value;
        }
    }
    if(guardian && Object.keys(guardian).length) {
        for(const [key, value] of Object.entries(guardian)) {
            modifiedUpdatedData[`guardian.${key}`] = value;
        }
    }
    if(localGuardian && Object.keys(localGuardian).length) {
        for(const [key, value] of Object.entries(localGuardian)) {
            modifiedUpdatedData[`localGuardian.${key}`] = value;
        }
    }

    const result = await Student.findOneAndUpdate({ id }, modifiedUpdatedData, {new: true, runValidators: true});
    if(!result) {
        throw new AppError(httpStatus.BAD_REQUEST ,'Student not found');
    }
    return result;
};

export const StudentService = {
    getStudentAllDB,
    getStudentByIdDB,
    deleteStudentFromDB,
    updateStudentFromDB,
};
