import { Schema, model } from 'mongoose';
import { Guardian, LocalGuardian, Student, UserName } from './student.interface';

const UserNameSchema = new Schema<UserName>({
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
});

const GuardianSchema = new Schema<Guardian>({
    fatherName: { type: String, required: true },
    fatherOccupation: { type: String, required: true },
    fatherContactNumber: { type: String, required: true },
    motherName: { type: String, required: true },
    motherOccupation: { type: String, required: true },
    motherContactNumber: { type: String, required: true },
});

const LocalGuardianSchema = new Schema<LocalGuardian>({
    name: { type: String, required: true },
    occupation: { type: String, required: true },
    contactNumber: { type: String, required: true },
    address: { type: String, required: true },
});

const StudentSchema = new Schema<Student>({
    id: { type: String },
    name: UserNameSchema,
    gender: ["male", "female"],
    dateOfBirth: { type: String },
    email: { type: String, required: true },
    contactNumber: { type: String, required: true },
    emergencyContactNumber: { type: String, required: true },
    bloodGroup: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    presentAddress: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    guardian: GuardianSchema,
    localGuardian: LocalGuardianSchema,
    profileImage: { type: String },
    isActive: ["active", "blocked"],
});

export const StudentModel = model<Student>('Student', StudentSchema);