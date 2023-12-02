import { TMonth, TAcademicSemesterName, TAcademicSemesterCode, TAcademicSemesterNameCodeMapper } from './academicSemester.interface';

export const Months: TMonth[] = ['January', 'February', 'March', 'April', 'May', 'June', 
               'July', 'August', 'September', 'October', 'November','December'];
               
export const AcademicSemesterName: TAcademicSemesterName[] = ['Autumn', 'Fall', 'Summer']; 
export const AcademicSemesterCode: TAcademicSemesterCode[] = ['01', '02', '03'];


export const academicSemesterNameCodeMapper: TAcademicSemesterNameCodeMapper = {
    Autumn: '01',
    Summer: '02',
    Fall: '03',
};