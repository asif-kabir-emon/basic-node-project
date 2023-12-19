import { TAcademicFaculty } from './AcademicFaculty.interface';
import { AcademicFaculty } from './academicFaculty.model';

const createAcademicFacultyIntoDB = async (payload: TAcademicFaculty) => {
    const result = AcademicFaculty.create(payload);
    return result;
};

const getAllAcademicFacultyFromDB = async () => {
    const result = AcademicFaculty.find();
    return result;
};

const getAcademicFacultyByIdFromDB = async (id: string) => {
    const result = AcademicFaculty.findById(id);
    return result;
};

const updateAcademicFacultyIntoDB = async (
    id: string,
    payload: Partial<TAcademicFaculty>,
) => {
    const result = AcademicFaculty.findByIdAndUpdate({ _id: id }, payload, {
        new: true,
    });
    return result;
};

export const AcademicFacultyServices = {
    createAcademicFacultyIntoDB,
    getAllAcademicFacultyFromDB,
    getAcademicFacultyByIdFromDB,
    updateAcademicFacultyIntoDB,
};
