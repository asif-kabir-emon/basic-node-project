import { z } from 'zod';

const userNameValidationSchema = z.object({
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

const guardianValidationSchema = z.object({
    fatherName: z.string(),
    fatherOccupation: z.string(),
    fatherContactNumber: z.string(),
    motherName: z.string(),
    motherOccupation: z.string(),
    motherContactNumber: z.string(),
});

// Define LocalGuardian schema
const localGuardianValidationSchema = z.object({
    name: z.string(),
    occupation: z.string(),
    contactNumber: z.string(),
    address: z.string(),
});

// Define Student schema
const createStudentValidationSchema = z.object({
    body: z.object({
        password: z.string().min(8).max(20),
        student: z.object({
            name: userNameValidationSchema,
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
            guardian: guardianValidationSchema,
            localGuardian: localGuardianValidationSchema,
            admissionSemester: z.string(),
            academicDepartment: z.string(),
            profileImage: z.string().optional(),
        })
    }),
});

export const studentValidations = {
    createStudentValidationSchema,
};
