import Joi from 'joi';

const userNameSchema = Joi.object({
    firstName: Joi.string()
        .trim()
        .min(4)
        .max(20)
        .regex(/^[A-Z][a-z]+$/)
        .required()
        .messages({
            'string.base': 'First name must be a string',
            'string.empty': 'First name cannot be empty',
            'string.min': 'First name should have at least {#limit} characters',
            'string.max': 'First name should not exceed {#limit} characters',
            'string.pattern.base':
                'First name should start with a capital letter and contain only alphabets',
            'any.required': 'First name is required',
        }),
    middleName: Joi.string().trim(),
    lastName: Joi.string()
        .trim()
        .regex(/^[A-Za-z]+$/)
        .required()
        .messages({
            'string.base': 'Last name must be a string',
            'string.empty': 'Last name cannot be empty',
            'string.pattern.base': 'Last name should contain only alphabets',
            'any.required': 'Last name is required',
        }),
});

const guardianSchema = Joi.object({
    fatherName: Joi.string().required(),
    fatherOccupation: Joi.string().required(),
    fatherContactNumber: Joi.string().required(),
    motherName: Joi.string().required(),
    motherOccupation: Joi.string().required(),
    motherContactNumber: Joi.string().required(),
});

const localGuardianSchema = Joi.object({
    name: Joi.string().required(),
    occupation: Joi.string().required(),
    contactNumber: Joi.string().required(),
    address: Joi.string().required(),
});

const studentValidationSchema = Joi.object({
    id: Joi.string().required(),
    name: userNameSchema.required(),
    gender: Joi.string().valid('male', 'female', 'other').required(),
    dateOfBirth: Joi.string(),
    email: Joi.string().email().required(),
    contactNumber: Joi.string().required(),
    emergencyContactNumber: Joi.string().required(),
    bloodGroup: Joi.string().valid(
        'A+',
        'A-',
        'B+',
        'B-',
        'AB+',
        'AB-',
        'O+',
        'O-',
    ),
    presentAddress: Joi.string().required(),
    permanentAddress: Joi.string().required(),
    guardian: guardianSchema.required(),
    localGuardian: localGuardianSchema.required(),
    profileImage: Joi.string(),
    isActive: Joi.string().valid('active', 'inactive').default('active'),
});

export const StudentValidation = { studentValidationSchema };
