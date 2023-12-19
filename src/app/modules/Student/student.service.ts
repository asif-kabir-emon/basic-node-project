/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import { Student } from './student.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import { TStudent } from './student.interface';
import QueryBuilder from '../../builder/QueryBuilder';
import { studentSearchableFields } from './student.constant';

const getStudentAllDB = async (query: Record<string, unknown>) => {
    // const queryObj = { ...query };

    // const studentSearchableFields = ['email', 'name.firstName', 'presentAddress'];

    // let searchTerm = '';

    // if(query?.searchTerm) {
    //     searchTerm = query?.searchTerm as string;
    // }

    // const searchQuery = Student.find({
    //     $or: studentSearchableFields.map
    //     ((field) => ({
    //         [field]: { $regex : searchTerm, $options: 'i' },
    //     })),
    // });

    // const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];

    // excludeFields.forEach((el) => delete queryObj[el]);

    // const filterQuery = searchQuery
    //     .find(queryObj)
    //     .populate('admissionSemester')
    //     .populate({
    //         path: "academicDepartment",
    //         populate: "academicFaculty",
    //     });

    // let sort = "-createdAt";
    // if(query.sort) {
    //     sort = query.sort as string;
    // }
    // const sortQuery = filterQuery.sort(sort);

    // let limit = 1;
    // if(query.limit) {
    //     limit = Number(query.limit);
    // }

    // let page = 1;
    // let skip = 0;
    // if(query.page) {
    //     page = Number(query.page);
    //     skip = (page - 1) * limit;
    // }

    // console.log({query}, {queryObj});

    // const paginateQuery = sortQuery.skip(skip);
    // const limitQuery = paginateQuery.limit(limit);

    // let fields = '-__v';

    // if(query.fields) {
    //     fields = (query.fields as string).split(',').join(' ');
    //     // fields = fields + ' -__v';
    // }

    // console.log(fields);

    // const fieldQuery = await limitQuery.select(fields);

    // return fieldQuery;

    const studentQuery = new QueryBuilder(Student.find(), query)
        .search(studentSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await studentQuery.modelQuery
        .populate('admissionSemester')
        .populate({
            path: 'academicDepartment',
            populate: 'academicFaculty',
        });
    return result;
};

const getStudentByIdDB = async (id: string) => {
    const result = await Student.findById(id)
        .populate('admissionSemester')
        .populate({
            path: 'academicDepartment',
            populate: 'academicFaculty',
        });
    return result;
};

const deleteStudentFromDB = async (id: string) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        const deletedStudent = await Student.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true, session },
        );

        if (!deletedStudent) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Failed to delete student',
            );
        }

        const userId = deletedStudent.user;

        const deletedUser = await User.findOneAndUpdate(
            { id: userId },
            { isDeleted: true },
            { new: true, session },
        );

        if (!deletedUser) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user');
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

    const modifiedUpdatedData: Record<string, unknown> = {
        ...remainingStudentData,
    };

    if (name && Object.keys(name).length) {
        for (const [key, value] of Object.entries(name)) {
            modifiedUpdatedData[`name.${key}`] = value;
        }
    }
    if (guardian && Object.keys(guardian).length) {
        for (const [key, value] of Object.entries(guardian)) {
            modifiedUpdatedData[`guardian.${key}`] = value;
        }
    }
    if (localGuardian && Object.keys(localGuardian).length) {
        for (const [key, value] of Object.entries(localGuardian)) {
            modifiedUpdatedData[`localGuardian.${key}`] = value;
        }
    }

    const result = await Student.findByIdAndUpdate(id, modifiedUpdatedData, {
        new: true,
        runValidators: true,
    });
    if (!result) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Student not found');
    }
    return result;
};

export const StudentService = {
    getStudentAllDB,
    getStudentByIdDB,
    deleteStudentFromDB,
    updateStudentFromDB,
};
