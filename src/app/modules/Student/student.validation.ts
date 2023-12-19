import { z } from 'zod';

// ---------- Create Validation Schema ----------
const createUserNameValidationSchema = z.object({
    firstName: z.string().min(4).max(20),
    middleName: z.string().optional(),
    lastName: z.string().min(4).max(20),
});

const createGuardianValidationSchema = z.object({
    fatherName: z.string(),
    fatherOccupation: z.string(),
    fatherContactNumber: z.string(),
    motherName: z.string(),
    motherOccupation: z.string(),
    motherContactNumber: z.string(),
});

// Define LocalGuardian schema
const createLocalGuardianValidationSchema = z.object({
    name: z.string(),
    occupation: z.string(),
    contactNumber: z.string(),
    address: z.string(),
});

const createStudentValidationSchema = z.object({
    body: z.object({
        password: z.string().min(8).max(20),
        student: z.object({
            name: createUserNameValidationSchema,
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
            guardian: createGuardianValidationSchema,
            localGuardian: createLocalGuardianValidationSchema,
            admissionSemester: z.string(),
            academicDepartment: z.string(),
            profileImage: z.string().optional(),
        }),
    }),
});

// ---------- Update Validation Schema ----------
const updateUserNameValidationSchema = z.object({
    firstName: z.string().min(4).max(20).optional(),
    middleName: z.string().optional(),
    lastName: z.string().min(4).max(20).optional(),
});

const updateGuardianValidationSchema = z.object({
    fatherName: z.string().optional(),
    fatherOccupation: z.string().optional(),
    fatherContactNumber: z.string().optional(),
    motherName: z.string().optional(),
    motherOccupation: z.string().optional(),
    motherContactNumber: z.string().optional(),
});

// Define LocalGuardian schema
const updateLocalGuardianValidationSchema = z.object({
    name: z.string().optional(),
    occupation: z.string().optional(),
    contactNumber: z.string().optional(),
    address: z.string().optional(),
});

const updateStudentValidationSchema = z.object({
    body: z.object({
        student: z.object({
            name: updateUserNameValidationSchema.optional(),
            gender: z.enum(['male', 'female', 'other']).optional(),
            dateOfBirth: z.string().optional(),
            email: z.string().email().optional(),
            contactNumber: z.string().optional(),
            emergencyContactNumber: z.string().optional(),
            bloodGroup: z
                .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
                .optional(),
            presentAddress: z.string().optional(),
            permanentAddress: z.string().optional(),
            guardian: updateGuardianValidationSchema.optional(),
            localGuardian: updateLocalGuardianValidationSchema.optional(),
            admissionSemester: z.string().optional(),
            academicDepartment: z.string().optional(),
            profileImage: z.string().optional().optional(),
        }),
    }),
});

export const studentValidations = {
    createStudentValidationSchema,
    updateStudentValidationSchema,
};
