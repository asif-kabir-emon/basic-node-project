import { Schema, model } from 'mongoose';
import {
    TGuardian,
    TLocalGuardian,
    TStudent,
    TUserName,
    // StudentMethods,
    StudentModel,
} from './student.interface';
import validator from 'validator';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const UserNameSchema = new Schema<TUserName>({
    firstName: {
        type: String,
        trim: true,
        required: [true, 'First name is required'],
        minLength: [4, 'First name cannot be less than 3 characters'],
        maxLength: [20, 'First name cannot be more than 20 characters'],
    },
    middleName: {
        type: String,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
        required: [true, 'Last name is required'],
        validate: {
            validator: (value: string) => validator.isAlpha(value),
            message: '{VALUE} is not a valid',
        },
    },
});

const GuardianSchema = new Schema<TGuardian>({
    fatherName: {
        type: String,
        required: [true, 'Father name is required'],
    },
    fatherOccupation: {
        type: String,
        required: [true, 'Father occupation is required'],
    },
    fatherContactNumber: {
        type: String,
        required: [true, 'Father contact number is required'],
    },
    motherName: {
        type: String,
        required: [true, 'Mother name is required'],
    },
    motherOccupation: {
        type: String,
        required: [true, 'Mother occupation is required'],
    },
    motherContactNumber: {
        type: String,
        required: [true, 'Mother contact number is required'],
    },
});

const LocalGuardianSchema = new Schema<TLocalGuardian>({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    occupation: {
        type: String,
        required: [true, 'Occupation is required'],
    },
    contactNumber: {
        type: String,
        required: [true, 'Contact number is required'],
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
    },
});

const StudentSchema = new Schema<TStudent, StudentModel>(
    {
        id: {
            type: String,
            required: [true, 'ID is required'],
        },
        user: {
            type: Schema.Types.ObjectId,
            required: [true, 'User ID is required'],
            unique: true,
            ref: 'User',
        },
        name: {
            type: UserNameSchema,
            required: [true, 'Name is required'],
        },
        gender: {
            type: String,
            lowercase: true,
            enum: {
                values: ['male', 'female', 'other'],
                message:
                    "The gender field can only be one of the following: 'male', 'female', 'other'",
            },
            required: [true, 'Gender is required'],
        },
        dateOfBirth: { type: Date },
        email: {
            type: String,
            unique: true,
            required: [true, 'Email is required'],
            validate: {
                validator: (value: string) => validator.isEmail(value),
                message: '{VALUE} is not a valid email',
            },
        },
        contactNumber: {
            type: String,
            required: [true, 'Contact number is required'],
        },
        emergencyContactNumber: {
            type: String,
            required: [true, 'Emergency contact number is required'],
        },
        bloodGroup: {
            type: String,
            enum: {
                values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
                message: '{VALUE} is not a valid blood group',
            },
        },
        presentAddress: {
            type: String,
            required: [true, 'Present address is required'],
        },
        permanentAddress: {
            type: String,
            required: [true, 'Permanent address is required'],
        },
        guardian: {
            type: GuardianSchema,
            required: [true, 'Guardian is required'],
        },
        role: {
            type: String,
            enum: ['student'],
            default: 'student',
        },
        localGuardian: {
            type: LocalGuardianSchema,
            required: [true, 'Local guardian is required'],
        },
        profileImage: { type: String, default: '' },
        admissionSemester: {
            type: Schema.Types.ObjectId,
            required: [true, 'Admission semester is required'],
            ref: 'AcademicSemester',
        },
        academicDepartment: {
            type: Schema.Types.ObjectId,
            required: [true, 'Admission department is required'],
            ref: 'AcademicDepartment',
        },
        academicFaculty: {
            type: Schema.Types.ObjectId,
            required: [true, 'Admission faculty is required'],
            ref: 'AcademicFaculty',
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        toJSON: {
            virtuals: true,
        },
    },
);

StudentSchema.virtual('fullName').get(function () {
    return `${this?.name?.firstName} ${
        this?.name?.middleName ? this?.name?.middleName : ''
    } ${this?.name?.lastName}`;
});

// Pre query middleware hook
StudentSchema.pre('find', function (next) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    this.find({ isDeleted: { $ne: true } });
    next();
});
StudentSchema.pre('findOne', function (next) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    this.find({ isDeleted: { $ne: true } });
    next();
});
StudentSchema.pre('aggregate', function (next) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});

StudentSchema.pre('findOneAndUpdate', async function (next) {
    const query = this.getQuery();
    const isStudentExists = await Student.findOne({
        id: query.id,
        isDeleted: { $ne: true },
    });
    if (!isStudentExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Student not found');
    }
    next();
});

// creating a custom static method
StudentSchema.statics.isUserExists = async function (id: string) {
    const existingUser = await Student.findOne({ id: id });
    return existingUser;
};

export const Student = model<TStudent, StudentModel>('Student', StudentSchema);
