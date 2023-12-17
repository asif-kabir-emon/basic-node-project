import { Schema, model } from "mongoose";
import { TCourse, TCourseFaculty, TPreRequisiteCourse } from "./course.interface";

const preRequisiteCoursesSchema = new Schema<TPreRequisiteCourse>({
    course: {
        type: Schema.Types.ObjectId,
        trim: true,
        ref: "Course",
    },
    isDeleted: {
        type: Boolean,
        trim: true,
        default: false,
    },
},
{
    _id: false,
},
);

const courseSchema = new Schema<TCourse>({
    title: {
        type: String,
        unique: true,
        trim: true,
        required: true,
    },
    prefix: {
        type: String,
        trim: true,
        required: true,
    },
    code: {
        type: Number,
        trim: true,
        required: true,
    },
    credits: {
        type: Number,
        trim: true,
        required: true,
    },
    preRequisiteCourses: [
        preRequisiteCoursesSchema,
    ],
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { 
    timestamps: true
});


export const Course = model<TCourse>("Course", courseSchema);

const courseFacultySchema = new Schema<TCourseFaculty>({
    course: {
        type: Schema.Types.ObjectId,
        trim: true,
        ref: "Course",
        unique: true,
    },
    faculties: [
        {
            type: Schema.Types.ObjectId,
            trim: true,
            ref: "AcademicFaculty",
        }
    ]
}, { 
    timestamps: true
});

export const CourseFaculty = model<TCourseFaculty>("CourseFaculty", courseFacultySchema);