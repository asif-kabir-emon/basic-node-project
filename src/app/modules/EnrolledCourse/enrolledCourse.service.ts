import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { OfferedCourse } from '../OfferedCourse/offeredCourse.model';
import { TEnrolledCourse } from './enrolledCourse.interface';
import { EnrolledCourse } from './enrolledCourse.model';
import { Student } from '../student/student.model';
import mongoose from 'mongoose';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { Course } from '../Course/course.model';
import { Faculty } from '../Faculty/faculty.model';
import { calculateGradeAndPoints } from './enrolledCourse.utils';
import QueryBuilder from '../../builder/QueryBuilder';

const createEnrolledCourseIntoDB = async (
    useId: string,
    payload: TEnrolledCourse,
) => {
    const { offeredCourse } = payload;
    const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse);
    if (!isOfferedCourseExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Offered course not found');
    }

    if (isOfferedCourseExists.maxCapacity <= 0) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Room is full');
    }

    const course = await Course.findById(isOfferedCourseExists.course).select(
        'credits',
    );

    const student = await Student.findOne({ id: useId }).select('_id');
    if (!student) {
        throw new AppError(httpStatus.NOT_FOUND, 'Student not found');
    }

    const isUserAlreadyEnrolled = await EnrolledCourse.findOne({
        semesterRegistration: isOfferedCourseExists?.semesterRegistration,
        student: student?._id,
        offeredCourse,
    });
    if (isUserAlreadyEnrolled) {
        throw new AppError(httpStatus.CONFLICT, 'Student is already enrolled');
    }

    // check total credit hours of a student exceeds maximum credit hours
    const semesterRegistration = await SemesterRegistration.findById(
        isOfferedCourseExists?.semesterRegistration,
    ).select('maxCredit');
    const enrolledCourses = await EnrolledCourse.aggregate([
        {
            $match: {
                semesterRegistration:
                    isOfferedCourseExists.semesterRegistration,
                student: student._id,
            },
        },
        {
            $lookup: {
                from: 'courses',
                localField: 'course',
                foreignField: '_id',
                as: 'enrolledCourseData',
            },
        },
        {
            $unwind: '$enrolledCourseData',
        },
        {
            $group: {
                _id: null,
                totalEnrolledCredits: { $sum: '$enrolledCourseData.credits' },
            },
        },
        {
            $project: {
                _id: 0,
                totalEnrolledCredits: 1,
            },
        },
    ]);

    const totalEnrolledCredits =
        enrolledCourses.length > 0
            ? enrolledCourses[0]?.totalEnrolledCredits
            : 0;
    const maxCredit = semesterRegistration?.maxCredit;
    const currentCredit = course?.credits;

    if (
        totalEnrolledCredits &&
        maxCredit &&
        totalEnrolledCredits + currentCredit > maxCredit
    ) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Maximum credit hours exceeded',
        );
    }

    const session = await mongoose.startSession();

    try {
        await session.startTransaction();

        const result = await EnrolledCourse.create(
            [
                {
                    semesterRegistration:
                        isOfferedCourseExists?.semesterRegistration,
                    academicSemester: isOfferedCourseExists?.academicSemester,
                    academicFaculty: isOfferedCourseExists?.academicFaculty,
                    academicDepartment:
                        isOfferedCourseExists?.academicDepartment,
                    offeredCourse: offeredCourse,
                    course: isOfferedCourseExists?.course,
                    student: student?._id,
                    faculty: isOfferedCourseExists?.faculty,
                    isEnrolled: true,
                },
            ],
            { session },
        );

        if (!result) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Failed to enroll course',
            );
        }

        const maxCapacity = isOfferedCourseExists.maxCapacity;
        await OfferedCourse.findByIdAndUpdate(
            offeredCourse,
            { maxCapacity: maxCapacity - 1 },
            { session },
        );

        await session.commitTransaction();
        await session.endSession();

        return result;
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to enroll course');
    }
};

const getMyEnrolledCoursesFromDB = async (
    studentId: string,
    query: Record<string, unknown>,
) => {
    const student = await Student.findOne({ id: studentId });

    if (!student) {
        throw new AppError(httpStatus.NOT_FOUND, 'Student not found !');
    }

    const enrolledCourseQuery = new QueryBuilder(
        EnrolledCourse.find({ student: student._id }).populate(
            'semesterRegistration academicSemester academicFaculty academicDepartment offeredCourse course student faculty',
        ),
        query,
    )
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await enrolledCourseQuery.modelQuery;
    const meta = await enrolledCourseQuery.countTotal();

    return {
        meta,
        result,
    };
};

const updateEnrolledCourseMarksIntoDB = async (
    facultyId: string,
    payload: Partial<TEnrolledCourse>,
) => {
    const { semesterRegistration, offeredCourse, student, courseMarks } =
        payload;

    const isSemesterRegistrationExists =
        await SemesterRegistration.findById(semesterRegistration);
    if (!isSemesterRegistrationExists) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Semester registration not found',
        );
    }

    const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse);
    if (!isOfferedCourseExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Offered course not found');
    }

    const isStudentExist = await Student.findById(student);
    if (!isStudentExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'Student not found!!');
    }

    const isStudentEnrolled = await EnrolledCourse.findOne({
        student,
        offeredCourse,
    });
    if (!isStudentEnrolled) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Student is not enrolled to this offered course',
        );
    }

    const faculty = await Faculty.findOne({ id: facultyId }).select('_id');
    if (!faculty) {
        throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found!!');
    }

    const isCourseBelongToFaculty = await EnrolledCourse.findOne({
        semesterRegistration,
        offeredCourse,
        student,
        faculty: faculty?._id,
    });

    if (!isCourseBelongToFaculty) {
        throw new AppError(
            httpStatus.FORBIDDEN,
            'Not authorized to update marks',
        );
    }

    const modifiedData: Record<string, unknown> = {};

    if (courseMarks?.finalTerm) {
        const { classTest1, classTest2, midTerm } =
            isCourseBelongToFaculty.courseMarks;

        const totalMarks =
            Math.ceil(classTest1 * 0.1) +
            Math.ceil(classTest2 * 0.1) +
            Math.ceil(midTerm * 0.3) +
            Math.ceil(courseMarks?.finalTerm * 0.5);

        console.log(totalMarks);

        const calculateGrade = calculateGradeAndPoints(totalMarks);
        modifiedData['grade'] = calculateGrade.grade;
        modifiedData['gradePoints'] = calculateGrade.gradePoints;
        modifiedData['isCompleted'] = true;
    }

    if (courseMarks && Object.keys(courseMarks).length) {
        for (const [key, value] of Object.entries(courseMarks)) {
            modifiedData[`courseMarks.${key}`] = value;
        }
    }
    console.log(modifiedData);

    const result = await EnrolledCourse.findByIdAndUpdate(
        isCourseBelongToFaculty._id,
        modifiedData,
        {
            new: true,
        },
    );

    return result;
};

export const EnrolledCourseServices = {
    createEnrolledCourseIntoDB,
    getMyEnrolledCoursesFromDB,
    updateEnrolledCourseMarksIntoDB,
};
