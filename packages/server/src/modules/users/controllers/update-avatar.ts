import { FastifyReply, FastifyRequest } from "fastify";
import { createUserRepository } from "../repository.js";
import { avatarValidator } from "../validations.js";
import { NotFoundError, ValidationError } from "../../../core/exceptions.js";
import { updateAvatarUseCase } from "../use-cases/update-avatar.js";

export async function updateAvatarController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const db = request.server.db;
  const fileUploadService = request.server.fileUploadService;
  const userRepository = createUserRepository(db);

  try {
    const file = await request.file();

    const result = await updateAvatarUseCase(
      {
        db: userRepository,
        fileUpload: fileUploadService,
        avatarValidator,
      },
      { avatarFile: file, userId: request.user.id },
    );

    return reply.code(200).send(result);
  } catch (error) {
    if (error instanceof ValidationError) {
      return reply.code(400).send({ message: error.message });
    }

    if (error instanceof NotFoundError) {
      return reply.code(404).send({ message: error.message });
    }

    throw error;
  }
}
