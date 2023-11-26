import { z } from "zod";

const userValidationSchema = z.object({
    id: z.string(),
    password: z.string().min(6, "Password must be at least 6 characters long").max(20, "Password must be less than 20 characters"),
    needPasswordChange: z.boolean().optional().default(true),
    role: z.enum(["admin", "student", "faculty"]),
    status: z.enum(["in-progress", "blocked"]).default("in-progress"),
    isDeleted: z.boolean().optional(),
});

export const UserValidation = {
    userValidationSchema,
}