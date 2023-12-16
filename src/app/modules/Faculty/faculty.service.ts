/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { Faculty } from './faculty.model';
import { TFaculty } from './faculty.interface';
import { FacultySearchableFields } from './faculty.constant';

const getFacultyAllDB = async (query: Record<string,unknown>) => {
    const FacultyQuery = new QueryBuilder(Faculty.find(), query).search(FacultySearchableFields).filter().sort().paginate().fields();

    const result = await FacultyQuery.modelQuery
        .populate('admissionSemester')
        .populate({
            path: "academicDepartment",
            populate: "academicFaculty",
        });
    return result;
};


const getFacultyByIdDB = async (id: string) => {
    const result = await Faculty.findOne({id}).populate('admissionSemester')
                    .populate({
                        path: "academicDepartment",
                        populate: "academicFaculty",
                    });;
    return result;
};

const deleteFacultyFromDB = async (id: string) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        const deletedFaculty = await Faculty.findOneAndUpdate({ id }, { isDeleted: true }, { new: true, session });

        if(!deletedFaculty) {
            throw new AppError(httpStatus.BAD_REQUEST ,'Failed to delete student');
        }

        const deletedUser = await User.findOneAndUpdate({ id }, { isDeleted: true }, { new: true, session });

        if(!deletedUser) {
            throw new AppError(httpStatus.BAD_REQUEST ,'Failed to delete user');
        }

        await session.commitTransaction();
        await session.endSession();

        return deletedFaculty;
    } catch (err: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error(err);
    }
};

const updateFacultyFromDB = async (id: string, payload: Partial<TFaculty>) => {
    const { name, ...remainingStudentData } = payload;

    const modifiedUpdatedData: Record<string, unknown> = {...remainingStudentData};

    if(name && Object.keys(name).length) {
        for(const [key, value] of Object.entries(name)) {
            modifiedUpdatedData[`name.${key}`] = value;
        }
    }

    const result = await Faculty.findOneAndUpdate({ id }, modifiedUpdatedData, {new: true, runValidators: true});
    if(!result) {
        throw new AppError(httpStatus.BAD_REQUEST ,'Student not found');
    }
    return result;
};


export const FacultyService = {
    getFacultyAllDB,
    getFacultyByIdDB,
    deleteFacultyFromDB,
    updateFacultyFromDB,
};