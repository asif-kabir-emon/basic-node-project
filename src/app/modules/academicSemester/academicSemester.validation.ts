import { z } from 'zod';
import {
    AcademicSemesterCode,
    AcademicSemesterName,
    Months,
} from './academicSemester.const';

const createAcademicSemesterValidationSchema = z.object({
    body: z.object({
        name: z.enum([...AcademicSemesterName] as [string, ...string[]]),
        code: z.enum([...AcademicSemesterCode] as [string, ...string[]]),
        year: z
            .string()
            .length(4)
            .regex(/^[0-9]+$/)
            .min(4)
            .max(4),
        startMonth: z.enum([...Months] as [string, ...string[]]),
        endMonth: z.enum([...Months] as [string, ...string[]]),
    }),
});

const updateAcademicSemesterValidationSchema = z.object({
    body: z.object({
        name: z
            .enum([...AcademicSemesterName] as [string, ...string[]])
            .optional(),
        code: z
            .enum([...AcademicSemesterCode] as [string, ...string[]])
            .optional(),
        year: z
            .string()
            .length(4)
            .regex(/^[0-9]+$/)
            .min(4)
            .max(4)
            .optional(),
        startMonth: z.enum([...Months] as [string, ...string[]]).optional(),
        endMonth: z.enum([...Months] as [string, ...string[]]).optional(),
    }),
});

export const AcademicSemesterValidations = {
    createAcademicSemesterValidationSchema,
    updateAcademicSemesterValidationSchema,
};
