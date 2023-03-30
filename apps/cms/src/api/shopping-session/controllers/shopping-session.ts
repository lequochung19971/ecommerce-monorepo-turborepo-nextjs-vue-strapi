/**
 * shopping-session controller
 */

import { factories } from "@strapi/strapi";
import { Controller } from "@strapi/strapi/lib/core-api/controller";
import { AddItemToShoppingSessionRequest } from "../types";
import { addItemToShoppingSessionRequestValidation as addItemToShoppingSessionRequestValidation } from "../validation";

export default factories.createCoreController(
  "api::shopping-session.shopping-session",
  ({ strapi }) => ({
    async addItemToShoppingSession(ctx) {
      try {
        const that = this as Controller;
        const { userId, productId } = ctx.request
          .body as AddItemToShoppingSessionRequest;
        console.log(ctx.request.header);

        const validationResult =
          addItemToShoppingSessionRequestValidation.validate({
            userId,
            productId,
          });

        if (validationResult.error) {
          return ctx.badRequest(
            validationResult.error.message,
            validationResult.error.details
          );
        }

        const user = await strapi.db
          .query("plugin::users-permissions.user")
          .findOne({
            where: {
              id: userId,
            },
          });

        if (!user) {
          return ctx.notFound("User is not found");
        }

        const product = await strapi.db.query("api::product.product").findOne({
          where: {
            id: productId,
          },
        });

        if (!product) {
          return ctx.notFound("Product is not found");
        }

        const result = await strapi
          .service("api::shopping-session.shopping-session")
          .addItemToShoppingSession({
            user,
            product,
          });

        ctx.response.body = await that.sanitizeOutput(result, ctx);
      } catch (error) {
        ctx.internalServerError(error);
      }
    },
  })
);
