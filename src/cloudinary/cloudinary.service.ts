import 'multer';
import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'lms/thumbnails',
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) {
            return reject(new BadRequestException(error.message));
          }
          if (!result) {
            return reject(new BadRequestException('File upload failed'));
          }
          resolve(result);
        },
      );

      Readable.from(file.buffer).pipe(uploadStream);
    });
  }

  // Upload a raw PDF Buffer to cloudinary
  async uploadPdfBuffer(
    pdfBuffer: Buffer,
    fileName: string,
    folder: string = `lms/certificates`,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: fileName,
          resource_type: 'image',
          format: 'pdf',
        },
        (error, result) => {
          if(error){
            return reject(new BadRequestException(error.message));
          }
          if(!result){
            return reject(new BadRequestException('PDF upload failed'));
          }
          resolve(result);
        },
      );

      Readable.from(pdfBuffer).pipe(uploadStream);
    });
  }
}
