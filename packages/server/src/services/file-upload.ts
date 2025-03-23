import {
  v2 as cloudinary,
  type ConfigAndUrlOptions,
  UploadApiResponse,
  type TransformationOptions,
} from "cloudinary";
import { config } from "../config.js";
import type { Readable } from "stream";

cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinarySecret,
});

export async function uploadFile(stream: Readable): Promise<UploadApiResponse> {
  const uploadResult = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      (error, uploadResult) => {
        if (error) {
          return reject(
            new Error("Something went wrong. Please try again later"),
          );
        }

        return resolve(uploadResult);
      },
    );

    stream.pipe(uploadStream);
  });

  return uploadResult as UploadApiResponse;
}

export function getOptimizedUrl(
  publicId: string,
  options?: TransformationOptions | ConfigAndUrlOptions,
) {
  return cloudinary.url(publicId, options);
}

export function deleteFile(publicId: string) {
  return cloudinary.uploader.destroy(publicId);
}
