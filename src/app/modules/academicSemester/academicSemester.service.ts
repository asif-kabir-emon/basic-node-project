import { academicSemesterNameCodeMapper } from "./academicSemester.const";
import { TAcademicSemester } from "./academicSemester.interface";
import { AcademicSemester } from "./academicSemester.model"


const CreateAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
    if(academicSemesterNameCodeMapper[payload.name] !== payload.code) {
        throw new Error('Invalid semester code');
    }

    const result = await AcademicSemester.create(payload);
    return result;
}

const getAllAcademicSemesterFromDB = async () => {
    const result = await AcademicSemester.find();
    return result;
}

const getAcademicSemesterByIdFromDB = async (id: string) => {
    const result = await AcademicSemester.findById(id);
    return result;
}

const updateAcademicSemesterByIdFromDB = async (id: string, payload: Partial<TAcademicSemester>) => {
    if(payload.name && payload.code && academicSemesterNameCodeMapper[payload.name] !== payload.code) {
        throw new Error('Invalid semester code');
    }
    const result = await AcademicSemester.findByIdAndUpdate(id, payload, { new: true });
    return result;
}

export const AcademicSemesterServices = {
    CreateAcademicSemesterIntoDB,
    getAllAcademicSemesterFromDB,
    getAcademicSemesterByIdFromDB,
    updateAcademicSemesterByIdFromDB,   
}