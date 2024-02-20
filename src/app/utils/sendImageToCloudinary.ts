import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import fs from 'fs';
import config from '../config';

cloudinary.config({
    cloud_name: config.cloud_name,
    api_key: config.cloud_api_key,
    api_secret: config.cloud_api_secret,
});

export const sendImageToCloudinary = async (
    imageName: string,
    path: string,
): Promise<Record<string, unknown>> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
            path,
            { public_id: imageName },
            function (error, result) {
                // console.log(result);
                if (error) {
                    reject(error);
                }
                if (!result) {
                    reject(new Error('Failed to upload image to Cloudinary.'));
                }
                resolve(result || {});
                fs.unlink(path, (err) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log('file deleted');
                    }
                });
            },
        );
    });
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.cwd() + '/uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    },
});

export const upload = multer({ storage: storage });
