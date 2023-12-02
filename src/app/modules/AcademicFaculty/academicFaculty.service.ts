import { TAcademicFaculty } from "./AcademicFaculty.interface";
import { AcademicFaculty } from "./academicFaculty.model";

const createAcademicFacultyIntoDB = async (payload: TAcademicFaculty) => {
    const result = AcademicFaculty.create(payload);
    return result;
}

export const AcademicFacultyServices = {
    createAcademicFacultyIntoDB,
}