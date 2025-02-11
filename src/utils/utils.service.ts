import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary'

@Injectable()
export class UtilsService {
    constructor() {
        cloudinary.config({
            cloud_name: 'dzfwntfw7',
            api_key: '829143719124888',
            api_secret: '7DAHUmv8z3HXcUQV2AEdZMI2mkc'
        });
    }


    async imageUpload(file: Express.Multer.File) {
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({}, (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }).end(file.buffer);
        });

        return result;
    }

}
