import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { userResponseSchema } from "../../../../validations/user.js";
import { genericResponseSchema } from "../../../../validations/common.js";
import { avatarValidator } from "../../../../validations/user.js";
import { updateAvatarUseCase } from "../../../../use-cases/update-avatar.js";
import { userRepository } from "../../../../repositories/user.js";
import { NotFoundError, ValidationError } from "../../../../errors/common.js";

const updateAvatarRoute: FastifyPluginAsync = async (app) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "PATCH",
    url: "/avatar",
    schema: {
      description: "Updates the currently authenticated user's avatar.",
      summary: "Update current user avatar",
      tags: ["Me"],
      response: {
        200: userResponseSchema,
        404: genericResponseSchema,
        400: genericResponseSchema,
      },
    },
    async handler(request, reply) {
      try {
        const file = await request.file();

        if (!file) {
          return reply
            .code(400)
            .send({ message: "Avatar file is not provided" });
        }

        const result = await updateAvatarUseCase(
          {
            db: userRepository,
            fileUpload: app.fileUploadService,
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
    },
  });
};

export default updateAvatarRoute;
