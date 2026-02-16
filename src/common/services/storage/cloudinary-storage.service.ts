import { Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';
import { IStorageService } from './storage.interface';

@Injectable()
export class CloudinaryStorageService implements IStorageService {
  private readonly logger = new Logger(CloudinaryStorageService.name);

  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    folder = 'neo-telemetri',
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            this.logger.error(
              `Cloudinary upload failed: ${error.message}`,
              error.stack,
            );
            return reject(error);
          }
          if (!result) {
            return reject(new Error('Cloudinary upload returned no result'));
          }
          resolve(result.secure_url);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      // Extract public_id from URL
      // Example: https://res.cloudinary.com/demo/image/upload/v1234567890/folder/my_image.jpg
      // public_id: folder/my_image
      const splitUrl = fileUrl.split('/');
      const filename = splitUrl.pop()?.split('.')[0];
      const folder = splitUrl.pop();
      // This is a naive extraction and might need adjustment based on specific folder structure
      // Ideally, we store the public_id in DB, but requirement says "URL"

      if (filename && folder) {
        const publicId = `${folder}/${filename}`;
        await cloudinary.uploader.destroy(publicId);
      }
    } catch (error) {
      this.logger.warn(
        `Failed to delete file from Cloudinary: ${fileUrl}`,
        error,
      );
      // We don't throw here to avoid blocking main logic if cleanup fails
    }
  }
}
