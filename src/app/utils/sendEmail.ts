import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string, html: string) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: config.NODE_ENV === 'production',
        auth: {
            user: 'asifkabiremon@gmail.com',
            pass: 'ljcr vwpq ofou brfn',
        },
    });
    await transporter.sendMail({
        from: 'asifkabiremon@gmail.com',
        to,
        subject: 'Reset your password within 10 minutes!!',
        text: '',
        html,
    });
};
