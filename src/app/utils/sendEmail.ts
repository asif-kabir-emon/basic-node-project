import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string, html: string) => {
    const transporter = nodemailer.createTransport({
        host: config.smtp_host,
        port: Number(config.smtp_port),
        secure: config.NODE_ENV === 'production',
        auth: {
            user: config.smtp_user,
            pass: config.smtp_password,
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
