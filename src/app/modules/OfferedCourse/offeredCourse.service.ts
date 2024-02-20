import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TOfferedCourse } from './offeredCourse.interface';
import { OfferedCourse } from './offeredCourse.model';
import { AcademicFaculty } from '../AcademicFaculty/academicFaculty.model';
import { AcademicDepartment } from '../AcademicDepartment/academicDepartment.model';
import { Course } from '../Course/course.model';
import { Faculty } from '../Faculty/faculty.model';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { hasTimeConflict } from './offeredCourse.utils';
import QueryBuilder from '../../builder/QueryBuilder';
import { Student } from '../student/student.model';

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
    const {
        semesterRegistration,
        academicFaculty,
        academicDepartment,
        course,
        section,
        faculty,
        days,
        startTime,
        endTime,
    } = payload;

    const isSemesterRegistrationExist =
        await SemesterRegistration.findById(semesterRegistration);
    if (!isSemesterRegistrationExist) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Semester Registration not found !',
        );
    }

    const academicSemester = isSemesterRegistrationExist.academicSemester;

    const isAcademicFacultyExist =
        await AcademicFaculty.findById(academicFaculty);
    if (!isAcademicFacultyExist) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Academic Faculty not found !',
        );
    }

    const isAcademicDepartmentExist =
        await AcademicDepartment.findById(academicDepartment);
    if (!isAcademicDepartmentExist) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Academic Department not found !',
        );
    }

    const isCourseExist = await Course.findById(course);
    if (!isCourseExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'Course not found !');
    }

    const isFaculty = await Faculty.findById(faculty);
    if (!isFaculty) {
        throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found !');
    }

    // ----
    const isDepartmentBelongToFaculty = await AcademicDepartment.findOne({
        _id: academicDepartment,
        academicFaculty,
    });
    if (!isDepartmentBelongToFaculty) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `This ${isAcademicDepartmentExist.name} is not belongs to this ${isAcademicFacultyExist.name}`,
        );
    }

    const isSameOfferedCourseExistsWithSameRegisterWithSameSection =
        await OfferedCourse.findOne({
            semesterRegistration,
            course,
            section,
        });
    if (isSameOfferedCourseExistsWithSameRegisterWithSameSection) {
        throw new AppError(
            httpStatus.CONFLICT,
            'Offered course with same section is already exists.',
        );
    }

    // ----
    const assignedSchedules = await OfferedCourse.find({
        semesterRegistration,
        faculty,
        days: { $in: days },
    }).select('days startTime endTime');

    const newSchedule = {
        days,
        startTime,
        endTime,
    };

    assignedSchedules.forEach((schedule) => {
        const existingStartTime = new Date(
            `1970-01-01T${schedule.startTime}:00`,
        );
        const existingEndTime = new Date(`1970-01-01T${schedule.endTime}:00`);
        const newStartTime = new Date(`1970-01-01T${newSchedule.startTime}:00`);
        const newEndTime = new Date(`1970-01-01T${newSchedule.endTime}:00`);
        if (newStartTime < existingEndTime && newEndTime > existingStartTime) {
            throw new AppError(
                httpStatus.CONFLICT,
                'This faculty is not available that time.',
            );
        }
    });

    if (hasTimeConflict(assignedSchedules, newSchedule)) {
        throw new AppError(
            httpStatus.CONFLICT,
            'This faculty is not available that time.',
        );
    }

    const result = await OfferedCourse.create({ ...payload, academicSemester });
    return result;
};

const updateOfferedCourseIntoDB = async (
    id: string,
    payload: Pick<TOfferedCourse, 'faculty' | 'days' | 'startTime' | 'endTime'>,
) => {
    const { faculty, days, startTime, endTime } = payload;

    const isOfferedCourseExists = await OfferedCourse.findById(id);

    if (!isOfferedCourseExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Offered course not found !');
    }

    const isFacultyExists = await Faculty.findById(faculty);

    if (!isFacultyExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found !');
    }

    const semesterRegistration = isOfferedCourseExists.semesterRegistration;
    // get the schedules of the faculties

    // Checking the status of the semester registration
    const semesterRegistrationStatus =
        await SemesterRegistration.findById(semesterRegistration);

    if (semesterRegistrationStatus?.status !== 'UPCOMING') {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `You can not update this offered course as it is ${semesterRegistrationStatus?.status}`,
        );
    }

    // check if the faculty is available at that time.
    const assignedSchedules = await OfferedCourse.find({
        semesterRegistration,
        faculty,
        days: { $in: days },
    }).select('days startTime endTime');

    const newSchedule = {
        days,
        startTime,
        endTime,
    };

    if (hasTimeConflict(assignedSchedules, newSchedule)) {
        throw new AppError(
            httpStatus.CONFLICT,
            `This faculty is not available at that time ! Choose other time or day`,
        );
    }

    const result = await OfferedCourse.findByIdAndUpdate(id, payload, {
        new: true,
    });

    return result;
};

const deleteOfferedCourseFromDB = async (id: string) => {
    const isOfferedCourseExists = await OfferedCourse.findById(id);

    if (!isOfferedCourseExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Offered Course not found');
    }

    const semesterRegistration = isOfferedCourseExists.semesterRegistration;

    const semesterRegistrationStatus =
        await SemesterRegistration.findById(semesterRegistration).select(
            'status',
        );

    if (semesterRegistrationStatus?.status !== 'UPCOMING') {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `Offered course can not update ! because the semester ${semesterRegistrationStatus}`,
        );
    }

    const result = await OfferedCourse.findByIdAndDelete(id);

    return result;
};

const getAllOfferedCoursesFromDB = async (query: Record<string, unknown>) => {
    const offeredCourseQuery = new QueryBuilder(OfferedCourse.find(), query)
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await offeredCourseQuery.modelQuery;
    const meta = await offeredCourseQuery.countTotal();

    return {
        meta,
        result,
    };
};

const getMyOfferedCoursesFromDB = async (
    userId: string,
    query: Record<string, unknown>,
) => {
    const page = Number(query?.page) || 1;
    const limit = Number(query?.limit) || 10;
    const skip = (page - 1) * limit;

    const student = await Student.findOne({ id: userId });
    // find the student
    if (!student) {
        throw new AppError(httpStatus.NOT_FOUND, 'User is noty found');
    }

    //find current ongoing semester
    const currentOngoingRegistrationSemester =
        await SemesterRegistration.findOne({
            status: 'ONGOING',
        });

    if (!currentOngoingRegistrationSemester) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'There is no ongoing semester registration!',
        );
    }

    const aggregationQuery = [
        {
            $match: {
                semesterRegistration: currentOngoingRegistrationSemester?._id,
                academicFaculty: student.academicFaculty,
                academicDepartment: student.academicDepartment,
            },
        },
        {
            $lookup: {
                from: 'courses',
                localField: 'course',
                foreignField: '_id',
                as: 'course',
            },
        },
        {
            $unwind: '$course',
        },
        {
            $lookup: {
                from: 'enrolledcourses',
                let: {
                    currentOngoingRegistrationSemester:
                        currentOngoingRegistrationSemester._id,
                    currentStudent: student._id,
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: [
                                            '$semesterRegistration',
                                            '$$currentOngoingRegistrationSemester',
                                        ],
                                    },
                                    {
                                        $eq: ['$student', '$$currentStudent'],
                                    },
                                    {
                                        $eq: ['$isEnrolled', true],
                                    },
                                ],
                            },
                        },
                    },
                ],
                as: 'enrolledCourses',
            },
        },
        {
            $lookup: {
                from: 'enrolledcourses',
                let: {
                    currentStudent: student._id,
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: ['$student', '$$currentStudent'],
                                    },
                                    {
                                        $eq: ['$isCompleted', true],
                                    },
                                ],
                            },
                        },
                    },
                ],
                as: 'completedCourses',
            },
        },
        {
            $addFields: {
                completedCourseIds: {
                    $map: {
                        input: '$completedCourses',
                        as: 'completed',
                        in: '$$completed.course',
                    },
                },
            },
        },
        {
            $addFields: {
                isPreRequisitesFulFilled: {
                    $or: [
                        { $eq: ['$course.preRequisiteCourses', []] },
                        {
                            $setIsSubset: [
                                '$course.preRequisiteCourses.course',
                                '$completedCourseIds',
                            ],
                        },
                    ],
                },

                isAlreadyEnrolled: {
                    $in: [
                        '$course._id',
                        {
                            $map: {
                                input: '$enrolledCourses',
                                as: 'enroll',
                                in: '$$enroll.course',
                            },
                        },
                    ],
                },
            },
        },
        {
            $match: {
                isAlreadyEnrolled: false,
                isPreRequisitesFulFilled: true,
            },
        },
    ];

    const paginationQuery = [
        {
            $skip: skip,
        },
        {
            $limit: limit,
        },
    ];

    const result = await OfferedCourse.aggregate([
        ...aggregationQuery,
        ...paginationQuery,
    ]);

    const total = (await OfferedCourse.aggregate(aggregationQuery)).length;

    const totalPage = Math.ceil(result.length / limit);

    return {
        meta: {
            page,
            limit,
            total,
            totalPage,
        },
        result,
    };
};

const getSingleOfferedCourseFromDB = async (id: string) => {
    const offeredCourse = await OfferedCourse.findById(id);

    if (!offeredCourse) {
        throw new AppError(404, 'Offered Course not found');
    }

    return offeredCourse;
};

export const OfferedCourseServices = {
    createOfferedCourseIntoDB,
    updateOfferedCourseIntoDB,
    deleteOfferedCourseFromDB,
    getAllOfferedCoursesFromDB,
    getMyOfferedCoursesFromDB,
    getSingleOfferedCourseFromDB,
};
