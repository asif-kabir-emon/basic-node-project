import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TAcademicDepartment } from './academicDepartment.interface';
import { AcademicDepartment } from './academicDepartment.model';
import { AcademicFaculty } from '../AcademicFaculty/academicFaculty.model';

const createAcademicDepartmentIntoDB = async (payload: TAcademicDepartment) => {
    const isAcademicFacultyExist = await AcademicFaculty.findById(
        payload.academicFaculty,
    );
    if (!isAcademicFacultyExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'Academic Faculty Not Found');
    }
    const result = AcademicDepartment.create(payload);
    return result;
};

const getAllAcademicDepartmentFromDB = async () => {
    const result = AcademicDepartment.find().populate('academicFaculty');
    return result;
};

const getAcademicDepartmentByIdFromDB = async (id: string) => {
    const result = AcademicDepartment.findById(id);
    return result;
};

const updateAcademicDepartmentIntoDB = async (
    id: string,
    payload: Partial<TAcademicDepartment>,
) => {
    const result = AcademicDepartment.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
    return result;
};

export const AcademicDepartmentServices = {
    createAcademicDepartmentIntoDB,
    getAllAcademicDepartmentFromDB,
    getAcademicDepartmentByIdFromDB,
    updateAcademicDepartmentIntoDB,
};
