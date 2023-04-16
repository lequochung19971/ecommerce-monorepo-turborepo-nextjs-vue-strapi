/**
 * shopping-session controller
 */

import { factories } from "@strapi/strapi";
import { Controller } from "@strapi/strapi/lib/core-api/controller";
import { AddItemToShoppingSessionRequest } from "../types";
import { addItemToShoppingSessionRequestValidation } from "../validation";

export default factories.createCoreController(
  "api::shopping-session.shopping-session",
  ({ strapi }) => ({
    async addItemToShoppingSession(ctx) {
      try {
        const that = this as Controller;
        const { user } = ctx.state;
        const { productId } = ctx.request
          .body as AddItemToShoppingSessionRequest;

        const validationResult =
          addItemToShoppingSessionRequestValidation.validate({
            productId,
          });

        if (validationResult.error) {
          return ctx.badRequest(
            validationResult.error.message,
            validationResult.error.details
          );
        }

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
    async getShoppingSessionItemsQuantity(ctx) {
      try {
        const that = this as Controller;
        const { user } = ctx.state;

        const cartItems = await strapi.db
          .query("api::cart-item.cart-item")
          .findMany({
            where: {
              shopping_session: {
                user: {
                  id: user.id,
                },
              },
            },
          });

        const quantity = (cartItems ?? []).reduce((result, cartItem) => {
          result += cartItem.quantity;
          return result;
        }, 0);

        ctx.response.body = await that.sanitizeOutput(quantity, ctx);
      } catch (error) {
        throw error;
      }
    },
  })
);
