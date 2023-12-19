/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistration } from './semesterRegistration.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { RegistrationStatus } from './semesterRegistration.constant';
import mongoose from 'mongoose';
import { OfferedCourse } from '../OfferedCourse/offeredCourse.model';

const createSemesterRegistrationIntoDB = async (
    payload: TSemesterRegistration,
) => {
    const academicSemester = payload?.academicSemester;

    const isThereAnyUpcomingOrOngoingSemester =
        await SemesterRegistration.findOne({
            $or: [
                { status: RegistrationStatus.UPCOMING },
                { status: RegistrationStatus.ONGOING },
            ],
        });
    if (isThereAnyUpcomingOrOngoingSemester) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `There is already a ${isThereAnyUpcomingOrOngoingSemester.status} register semester!`,
        );
    }

    const isSemesterRegistrationExist = await SemesterRegistration.findOne({
        academicSemester: academicSemester,
    });
    if (isSemesterRegistrationExist) {
        throw new AppError(
            httpStatus.CONFLICT,
            'Semester registration is already exist',
        );
    }

    const isAcademicSemesterExist =
        await AcademicSemester.findById(academicSemester);
    if (!isAcademicSemesterExist) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Academic semester is not found',
        );
    }

    const result = await SemesterRegistration.create(payload);
    return result;
};

const getAllSemesterRegistrationFromDB = async (
    query: Record<string, unknown>,
) => {
    const semesterRegistrationQuery = new QueryBuilder(
        SemesterRegistration.find().populate('academicSemester'),
        query,
    )
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await semesterRegistrationQuery.modelQuery;
    return result;
};

const getSingleSemesterRegistrationFromDB = async (id: string) => {
    const result =
        await SemesterRegistration.findById(id).populate('academicSemester');
    return result;
};

const updateSemesterRegistrationIntoDB = async (
    id: string,
    payload: Partial<TSemesterRegistration>,
) => {
    const requestedStatus = payload?.status;
    const requestedSemester = await SemesterRegistration.findById(id);
    if (!requestedSemester) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Semester registration is not exist',
        );
    }

    if (requestedSemester?.status === RegistrationStatus.ENDED) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `This semester registration is already ended`,
        );
    }

    if (
        requestedSemester?.status === RegistrationStatus.UPCOMING &&
        requestedStatus === RegistrationStatus.ENDED
    ) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `You can not change the status directly from ${requestedSemester?.status} to ${requestedStatus}`,
        );
    }
    if (
        requestedSemester?.status === RegistrationStatus.ONGOING &&
        requestedStatus === RegistrationStatus.UPCOMING
    ) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `You can not change the status directly from ${requestedSemester?.status} to ${requestedStatus}`,
        );
    }

    const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });

    return result;
};

const deleteSemesterRegistrationFromDB = async (id: string) => {
    // checking if the semester registration is exist
    const isSemesterRegistrationExists =
        await SemesterRegistration.findById(id);

    if (!isSemesterRegistrationExists) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'This registered semester is not found !',
        );
    }

    // checking if the status is still "UPCOMING"
    const semesterRegistrationStatus = isSemesterRegistrationExists.status;

    if (semesterRegistrationStatus !== 'UPCOMING') {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `You can not update as the registered semester is ${semesterRegistrationStatus}`,
        );
    }

    const session = await mongoose.startSession();

    //deleting associated offered courses

    try {
        session.startTransaction();

        const deletedOfferedCourse = await OfferedCourse.deleteMany(
            {
                semesterRegistration: id,
            },
            {
                session,
            },
        );

        if (!deletedOfferedCourse) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Failed to delete semester registration !',
            );
        }

        const deletedSemesterRegistration =
            await SemesterRegistration.findByIdAndDelete(id, {
                session,
                new: true,
            });

        if (!deletedSemesterRegistration) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Failed to delete semester registration !',
            );
        }

        await session.commitTransaction();
        await session.endSession();

        return null;
    } catch (err: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error(err);
    }
};

export const SemesterRegistrationServices = {
    createSemesterRegistrationIntoDB,
    getAllSemesterRegistrationFromDB,
    getSingleSemesterRegistrationFromDB,
    updateSemesterRegistrationIntoDB,
    deleteSemesterRegistrationFromDB,
};
