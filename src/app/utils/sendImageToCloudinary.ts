import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import fs from 'fs';

cloudinary.config({
    cloud_name: 'dfmm7im1o',
    api_key: '876217717238836',
    api_secret: 'Ds6Ho2N_9hLEJ8x2K4jppn5BKt8',
});

export const sendImageToCloudinary = async (
    imageName: string,
    path: string,
) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
            path,
            { public_id: imageName },
            function (error, result) {
                // console.log(result);
                if (error) {
                    reject(error);
                }
                resolve(result);
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
