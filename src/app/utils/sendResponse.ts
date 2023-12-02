import { Response } from 'express';

type TResponse<T> = { statusCode: number, success: boolean, message?: string, data: T }

const sendResponse = <T>(res: Response, data: 
    { statusCode: number, success: boolean, message?: string, data: TResponse<T> }) => {
    return res.status(data.statusCode).json({
        success: data.success,
        message: data.message || 'Success',
        data: data.data,
    });
}

export default sendResponse;