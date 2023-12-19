import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import {
    AcademicSemesterCode,
    AcademicSemesterName,
    Months,
} from './academicSemester.const';
import { TAcademicSemester } from './academicSemester.interface';
import { Schema, model } from 'mongoose';

const academicSemesterSchema = new Schema<TAcademicSemester>(
    {
        name: {
            type: String,
            required: true,
            enum: AcademicSemesterName,
        },
        code: {
            type: String,
            required: true,
            enum: AcademicSemesterCode,
        },
        year: {
            type: String,
            required: true,
        },
        startMonth: {
            type: String,
            enum: Months,
            required: true,
        },
        endMonth: {
            type: String,
            enum: Months,
            required: true,
        },
    },
    { timestamps: true },
);

academicSemesterSchema.pre('save', async function (next) {
    const isSemesterExist = await AcademicSemester.findOne({
        name: this.name,
        year: this.year,
    });
    if (isSemesterExist) {
        throw new AppError(httpStatus.CONFLICT, 'Semester is already exist');
    }
    next();
});

export const AcademicSemester = model<TAcademicSemester>(
    'AcademicSemester',
    academicSemesterSchema,
);
