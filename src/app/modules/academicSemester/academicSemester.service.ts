import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import {
    AcademicSemesterSearchableFields,
    academicSemesterNameCodeMapper,
} from './academicSemester.const';
import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemester } from './academicSemester.model';
import QueryBuilder from '../../builder/QueryBuilder';

const CreateAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
    if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Invalid semester code');
    }

    const result = await AcademicSemester.create(payload);
    return result;
};

const getAllAcademicSemesterFromDB = async (query: Record<string, unknown>) => {
    const academicSemesterQuery = new QueryBuilder(
        AcademicSemester.find(),
        query,
    )
        .search(AcademicSemesterSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await academicSemesterQuery.modelQuery;
    const meta = await academicSemesterQuery.countTotal();

    return {
        meta,
        result,
    };
};

const getAcademicSemesterByIdFromDB = async (id: string) => {
    const result = await AcademicSemester.findById(id);
    return result;
};

const updateAcademicSemesterByIdFromDB = async (
    id: string,
    payload: Partial<TAcademicSemester>,
) => {
    if (
        payload.name &&
        payload.code &&
        academicSemesterNameCodeMapper[payload.name] !== payload.code
    ) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Invalid semester code');
    }
    const result = await AcademicSemester.findByIdAndUpdate(id, payload, {
        new: true,
    });
    return result;
};

export const AcademicSemesterServices = {
    CreateAcademicSemesterIntoDB,
    getAllAcademicSemesterFromDB,
    getAcademicSemesterByIdFromDB,
    updateAcademicSemesterByIdFromDB,
};
