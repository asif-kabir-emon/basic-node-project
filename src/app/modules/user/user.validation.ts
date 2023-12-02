import { z } from "zod";

const userValidationSchema = z.object({
    password: z
        .string({
            invalid_type_error: "Password must be a string",
        })
        .min(6, 
            {
                message: "Password must be at least 6 characters",
            })
        .max(20, {
            message: "Password must not exceed 20 characters",
        })
        .optional(),
    needPasswordChange: z
        .boolean({
            invalid_type_error: "Need password change must be a boolean",
        })
        .optional()
        .default(true),
    role: z.enum(["admin", "student", "faculty"]),
    status: z.enum(["in-progress", "blocked"]).default("in-progress")
});

export const UserValidation = {
    userValidationSchema,
}