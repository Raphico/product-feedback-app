import {
  v2 as cloudinary,
  type ConfigAndUrlOptions,
  UploadApiResponse,
  type TransformationOptions,
} from "cloudinary";
import type { Config } from "../config.js";
import type { Logger } from "pino";
import type { Readable } from "stream";
import { InternalServerError } from "../core/exceptions.js";

export class FileUploadService {
  constructor(
    private config: Config,
    private logger: Logger,
  ) {
    cloudinary.config({
      cloud_name: this.config.cloudinaryCloudName,
      api_key: this.config.cloudinaryApiKey,
      api_secret: this.config.cloudinarySecret,
    });
  }

  async uploadFile(stream: Readable): Promise<UploadApiResponse> {
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, uploadResult) => {
          if (error) {
            this.logger.error(error, "File upload failed");
            return reject(
              new InternalServerError(
                "Something went wrong. Please try again later",
              ),
            );
          }

          return resolve(uploadResult);
        },
      );

      stream.pipe(uploadStream);
    });

    return uploadResult as UploadApiResponse;
  }

  getOptimizedUrl(
    publicId: string,
    options?: TransformationOptions | ConfigAndUrlOptions,
  ) {
    return cloudinary.url(publicId, options);
  }

  deleteFile(publicId: string) {
    return cloudinary.uploader.destroy(publicId);
  }
}
