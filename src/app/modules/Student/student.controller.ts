import { StudentService } from './student.service';
import catchAsync from '../../utils/catchAsync';

const getAllStudents = catchAsync(async (req, res) => {
    console.log(req.query);
    const result = await StudentService.getStudentAllDB(req.query);
    res.status(200).send({
        success: true,
        message: 'Student fetched successfully',
        data: result,
    });
});

const getStudentByID = catchAsync(async (req, res) => {
    const studentId = req.params.studentId;
    const result = await StudentService.getStudentByIdDB(studentId);
    res.status(200).send({
        success: true,
        message: 'Student fetched successfully',
        data: result,
    });
});

const deleteStudent = catchAsync(async (req, res) => {
    const studentId = req.params.studentId;
    const result = await StudentService.deleteStudentFromDB(studentId);
    res.status(200).send({
        success: true,
        message: 'Student deleted successfully',
        data: result,
    });
});

const updateStudent = catchAsync(async (req, res) => {
    const studentId = req.params.studentId;
    const studentData = req.body.student;
    const result = await StudentService.updateStudentFromDB(studentId, studentData);
    res.status(200).send({
        success: true,
        message: 'Student updated successfully',
        data: result,
    });
});

export const StudentController = {
    getAllStudents,
    getStudentByID,
    deleteStudent,
    updateStudent,
};
