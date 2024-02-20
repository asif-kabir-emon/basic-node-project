import { Model, Types } from 'mongoose';

export interface TGuardian {
    fatherName: string;
    fatherOccupation: string;
    fatherContactNumber: string;
    motherName: string;
    motherOccupation: string;
    motherContactNumber: string;
}

export interface TUserName {
    firstName: string;
    middleName?: string;
    lastName: string;
}

export interface TLocalGuardian {
    name: string;
    occupation: string;
    contactNumber: string;
    address: string;
}

export interface TStudent {
    id: string;
    user: Types.ObjectId;
    name: TUserName;
    gender: 'male' | 'female' | 'other';
    dateOfBirth?: Date;
    email: string;
    role: 'student';
    contactNumber: string;
    emergencyContactNumber?: string;
    bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
    presentAddress: string;
    permanentAddress: string;
    guardian: TGuardian;
    localGuardian?: TLocalGuardian;
    admissionSemester: Types.ObjectId;
    academicDepartment: Types.ObjectId;
    academicFaculty: Types.ObjectId;
    profileImage?: string;
    isDeleted?: boolean;
}

// For creating a static method
export interface StudentModel extends Model<TStudent> {
    // eslint-disable-next-line no-unused-vars
    isUserExists(id: string): Promise<TStudent | null>;
}

// // For creating a instance method
// export type StudentMethods = {
//     isUserExists(id: string): Promise<TStudent | null>;
// }

// export type StudentModel = Model<TStudent, Record<string, never>, StudentMethods>;
