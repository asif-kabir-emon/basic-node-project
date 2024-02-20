import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { CourseSearchableFields } from './course.constant';
import { TCourse, TCourseFaculty } from './course.interface';
import { Course, CourseFaculty } from './course.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { Faculty } from '../Faculty/faculty.model';

const createCourseIntoDB = async (payload: TCourse) => {
    if (payload.preRequisiteCourses && payload.preRequisiteCourses.length > 0) {
        for (const preRequisite of payload.preRequisiteCourses) {
            const isCourseExists = await Course.findById(preRequisite.course);
            if (!isCourseExists) {
                throw new AppError(
                    httpStatus.BAD_REQUEST,
                    'Pre Requisite Course Not Found',
                );
            }
        }
    }

    const result = await Course.create(payload);
    return result;
};

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
    const courseQuery = new QueryBuilder(
        Course.find().populate('preRequisiteCourses.course'),
        query,
    )
        .search(CourseSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = await courseQuery.modelQuery;
    return result;
};

const getSingleCourseFromDB = async (id: string) => {
    const result = await Course.findById(id).populate(
        'preRequisiteCourses.course',
    );
    return result;
};

const deleteCourseIntoDB = async (id: string) => {
    const result = await Course.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true },
    );
    return result;
};

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
    const { preRequisiteCourses, ...courseRemainingData } = payload;

    const session = await mongoose.startSession();

    try {
        await session.startTransaction();

        const updatedBasicCourseInfo = await Course.findByIdAndUpdate(
            id,
            courseRemainingData,
            {
                new: true,
                runValidators: true,
                session,
            },
        );

        if (!updatedBasicCourseInfo) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Failed to Update Course',
            );
        }

        if (preRequisiteCourses && preRequisiteCourses.length > 0) {
            const deletedPreRequisitesCoursesID = preRequisiteCourses
                .filter(
                    (preRequisite) =>
                        preRequisite.course && preRequisite.isDeleted,
                )
                .map((preRequisite) => preRequisite.course);

            const deletedPreRequisitesCourses = await Course.findByIdAndUpdate(
                id,
                {
                    $pull: {
                        preRequisiteCourses: {
                            course: { $in: deletedPreRequisitesCoursesID },
                        },
                    },
                },
                {
                    new: true,
                    runValidators: true,
                    session,
                },
            );

            if (!deletedPreRequisitesCourses) {
                throw new AppError(
                    httpStatus.BAD_REQUEST,
                    'Failed to Update Course',
                );
            }

            const newPreRequisites = preRequisiteCourses?.filter(
                (preRequisite) =>
                    preRequisite.course && !preRequisite.isDeleted,
            );

            const newPreRequisitesCourses = await Course.findByIdAndUpdate(
                id,
                {
                    $addToSet: {
                        preRequisiteCourses: { $each: newPreRequisites },
                    },
                },
                {
                    new: true,
                    runValidators: true,
                    session,
                },
            );

            if (!newPreRequisitesCourses) {
                throw new AppError(
                    httpStatus.BAD_REQUEST,
                    'Failed to Update Course',
                );
            }
        }

        await session.commitTransaction();
        await session.endSession();

        const result = await Course.findById(id).populate(
            'preRequisiteCourses.course',
        );
        return result;
    } catch (err) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to Update Course');
    }
};

const assignFacultiesWithCourseIntoDB = async (
    id: string,
    faculties: string[],
) => {
    if (faculties && faculties.length > 0) {
        for (const faculty of faculties) {
            const isFacultyExists = await Faculty.findById(faculty);
            if (!isFacultyExists) {
                throw new AppError(httpStatus.BAD_REQUEST, 'Faculty Not Found');
            }
        }
    }

    const isCourseFacultyExists = await CourseFaculty.findOne({
        course: id,
    });

    if (!isCourseFacultyExists) {
        const result = await CourseFaculty.create({
            course: id,
            faculties: faculties,
        });
        return result;
    }

    const result = await CourseFaculty.findByIdAndUpdate(
        isCourseFacultyExists._id,
        {
            $addToSet: {
                faculties: {
                    $each: faculties,
                },
            },
        },
        {
            upsert: true,
            new: true,
        },
    );
    return result;
};

const removeFacultiesWithCourseFromDB = async (
    id: string,
    payload: Partial<TCourseFaculty>,
) => {
    const result = await CourseFaculty.findByIdAndUpdate(
        id,
        {
            $pull: {
                faculties: {
                    $in: payload,
                },
            },
        },
        {
            upsert: true,
            new: true,
        },
    );
    return result;
};

const getFacultiesWithCourseFromDB = async (id: string) => {
    const result = await CourseFaculty.findOne({
        course: id,
    }).populate('faculties');
    return result;
};

export const CourseServices = {
    createCourseIntoDB,
    getAllCoursesFromDB,
    getSingleCourseFromDB,
    deleteCourseIntoDB,
    updateCourseIntoDB,
    assignFacultiesWithCourseIntoDB,
    removeFacultiesWithCourseFromDB,
    getFacultiesWithCourseFromDB,
};
