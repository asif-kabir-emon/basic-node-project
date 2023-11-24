import { z } from 'zod';

const UserNameValidationSchema = z.object({
    firstName: z
        .string()
        .regex(/^[A-Z][a-z]+$/)
        .min(4)
        .max(20),
    middleName: z.string().optional(),
    lastName: z
        .string()
        .regex(/^[A-Za-z]+$/)
        .min(4)
        .max(20),
});

const GuardianValidationSchema = z.object({
    fatherName: z.string(),
    fatherOccupation: z.string(),
    fatherContactNumber: z.string(),
    motherName: z.string(),
    motherOccupation: z.string(),
    motherContactNumber: z.string(),
});

// Define LocalGuardian schema
const LocalGuardianValidationSchema = z.object({
    name: z.string(),
    occupation: z.string(),
    contactNumber: z.string(),
    address: z.string(),
});

// Define Student schema
const StudentValidationSchema = z.object({
    id: z.string(),
    password: z.string(),
    name: UserNameValidationSchema,
    gender: z.enum(['male', 'female', 'other']),
    dateOfBirth: z.string().optional(),
    email: z.string().email(),
    contactNumber: z.string(),
    emergencyContactNumber: z.string(),
    bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .optional(),
    presentAddress: z.string(),
    permanentAddress: z.string(),
    guardian: GuardianValidationSchema,
    localGuardian: LocalGuardianValidationSchema,
    profileImage: z.string().optional(),
    isActive: z.enum(['active', 'blocked']).default('active'),
    isDeleted: z.boolean().default(false),
});

export const ValidationSchema = {
    StudentValidationSchema,
};
