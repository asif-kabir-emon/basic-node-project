import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
    NODE_ENV: process.env.NODE_ENV,
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    default_password: process.env.DEFAULT_PASSWORD,
    jwt_access_token: process.env.JWT_ACCESS_SECRET,
    jwt_refresh_token: process.env.JWT_REFRESH_SECRET,
    jwt_access_expired_in: process.env.JWT_ACCESS_EXPIRES_IN,
    jwt_refresh_expired_in: process.env.JWT_REFRESH_EXPIRES_IN,
    reset_password_ui_link: process.env.RESET_PASSWORD_LINK,

    // SMTP
    smtp_host: process.env.SMTP_HOST,
    smtp_port: process.env.SMTP_PORT,
    smtp_user: process.env.SMTP_USER,
    smtp_password: process.env.SMTP_PASSWORD,

    // Cloudinary
    cloud_name: process.env.CLOUD_NAME,
    cloud_api_key: process.env.CLOUD_API_KEY,
    cloud_api_secret: process.env.CLOUD_API_SECRET,

    super_admin_password: process.env.SUPER_ADMIN_PASSWORD,
};
