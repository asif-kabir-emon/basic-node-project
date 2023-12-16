import { FacultyService } from './faculty.service';
import catchAsync from '../../utils/catchAsync';

const getAllFaculties = catchAsync(async (req, res) => {
    const result = await FacultyService.getFacultyAllDB(req.query);
    res.status(200).send({
        success: true,
        message: 'Faculties fetched successfully',
        data: result,
    });
});

const getFacultyByID = catchAsync(async (req, res) => {
    const studentId = req.params.studentId;
    const result = await FacultyService.getFacultyByIdDB(studentId);
    res.status(200).send({
        success: true,
        message: 'Faculty fetched successfully',
        data: result,
    });
});

const deleteFaculty = catchAsync(async (req, res) => {
    const studentId = req.params.studentId;
    const result = await FacultyService.deleteFacultyFromDB(studentId);
    res.status(200).send({
        success: true,
        message: 'Faculty deleted successfully',
        data: result,
    });
});

const updateFaculty = catchAsync(async (req, res) => {
    const studentId = req.params.studentId;
    const studentData = req.body.student;
    const result = await FacultyService.updateFacultyFromDB(studentId, studentData);
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
