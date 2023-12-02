import { StudentService } from './student.service';
import catchAsync from '../../utils/catchAsync';

const getAllStudents = catchAsync(async (req, res) => {
    const result = await StudentService.getStudentAllDB();
    res.status(200).send({
        success: true,
        message: 'Student fetched successfully',
        data: result,
    });
});

const getStudentByID = catchAsync(async (req, res) => {
    const studentId = req.params.id;
    const result = await StudentService.getStudentByIdDB(studentId);
    res.status(200).send({
        success: true,
        message: 'Student fetched successfully',
        data: result,
    });
});

const deleteStudent = catchAsync(async (req, res) => {
    const studentId = req.params.id;
    const result = await StudentService.deleteStudentFromDB(studentId);
    res.status(200).send({
        success: true,
        message: 'Student deleted successfully',
        data: result,
    });
});

export const StudentController = {
    getAllStudents,
    getStudentByID,
    deleteStudent,
};
