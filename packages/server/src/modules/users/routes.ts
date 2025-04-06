import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { verifyJWT } from "../../hooks/auth.js";
import {
  updateUserRoleSchema,
  updateUserSchema,
  userResponseSchema,
} from "./validations.js";
import {
  genericResponseSchema,
  idParamsSchema,
} from "../../shared/validation.js";
import { updateMeController } from "./controllers/update-me.js";
import { updateUserRoleController } from "./controllers/update-user-role.js";
import { getMeController } from "./controllers/get-me.js";

const usersRoute: FastifyPluginAsync = async (app) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "PATCH",
    url: "/",
    preHandler: [verifyJWT],
    schema: {
      description:
        "Updates the currently authenticated user's profile information.",
      summary: "Update current user details",
      tags: ["User"],
      body: updateUserSchema,
      response: {
        200: userResponseSchema,
        404: genericResponseSchema,
      },
    },
    handler: updateMeController,
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/",
    preHandler: [verifyJWT],
    schema: {
      description:
        "Fetches the currently authenticated user's profile information.",
      summary: "Get current user details",
      tags: ["User"],
      response: {
        200: userResponseSchema,
        404: genericResponseSchema,
      },
    },
    handler: getMeController,
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "PATCH",
    url: "/",
    preHandler: [verifyJWT],
    schema: {
      summary: "Update a user's role",
      description:
        "Allows an admin to update the role of a specific user by providing their ID and the new role.",
      tags: ["User"],
      params: idParamsSchema,
      body: updateUserRoleSchema,
      response: {
        200: userResponseSchema,
        404: genericResponseSchema,
        403: genericResponseSchema,
      },
    },
    handler: updateUserRoleController,
  });
};

export default usersRoute;
