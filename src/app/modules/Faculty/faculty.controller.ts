import { FacultyServices } from './faculty.service';
import catchAsync from '../../utils/catchAsync';

const getAllFaculties = catchAsync(async (req, res) => {
    const result = await FacultyServices.getAllFacultiesFromDB(req.query);
    res.status(200).send({
        success: true,
        message: 'Faculties fetched successfully',
        data: result,
    });
});

const getFacultyByID = catchAsync(async (req, res) => {
    const id = req.params.id;
    const result = await FacultyServices.getSingleFacultyFromDB(id);
    res.status(200).send({
        success: true,
        message: 'Faculty fetched successfully',
        data: result,
    });
});

const deleteFaculty = catchAsync(async (req, res) => {
    const id = req.params.id;
    const result = await FacultyServices.deleteFacultyFromDB(id);
    res.status(200).send({
        success: true,
        message: 'Faculty deleted successfully',
        data: result,
    });
});

const updateFaculty = catchAsync(async (req, res) => {
    const id = req.params.id;
    const studentData = req.body.student;
    const result = await FacultyServices.updateFacultyIntoDB(id, studentData);
    res.status(200).send({
        success: true,
        message: 'Faculty updated successfully',
        data: result,
    });
});

export const FacultyController = {
    getAllFaculties,
    getFacultyByID,
    deleteFaculty,
    updateFaculty,
};
