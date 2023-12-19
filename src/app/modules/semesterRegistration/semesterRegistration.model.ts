import { SemesterRegistrationStatus } from './semesterRegistration.constant';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { Schema, model } from 'mongoose';

const semesterRegistrationSchema = new Schema<TSemesterRegistration>(
    {
        academicSemester: {
            type: Schema.Types.ObjectId,
            ref: 'AcademicSemester',
            required: true,
            unique: true,
        },
        status: {
            type: String,
            enum: SemesterRegistrationStatus,
            default: 'UPCOMING',
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        minCredit: {
            type: Number,
            default: 3,
        },
        maxCredit: {
            type: Number,
            default: 15,
        },
    },
    { timestamps: false },
);

export const SemesterRegistration = model<TSemesterRegistration>(
    'SemesterRegistration',
    semesterRegistrationSchema,
);
