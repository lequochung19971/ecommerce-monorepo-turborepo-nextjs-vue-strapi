/**
 * order-detail controller
 */

import { factories } from "@strapi/strapi";
import { Controller } from "@strapi/strapi/lib/core-api/controller";
import { isEqual } from "lodash";
import { CreateOrderDetailRequest } from "types";
import { CreateOrderDetailArgs } from "../services/order-detail";

export default factories.createCoreController(
  "api::order-detail.order-detail",
  ({ strapi }) => ({
    async create(ctx) {
      try {
        const that = this as Controller;
        const { user } = ctx.state;

        console.log("Request", ctx.request.body);

        if (!user) {
          return ctx.notFound("User is not found");
        }

        const { itemIds, address, phoneNumber, email } = ctx.request
          .body as CreateOrderDetailRequest;

        const findResult = await strapi
          .service("api::cart-item.cart-item")
          .find({
            filters: {
              id: itemIds,
            },
            pagination: {
              start: 0,
              limit: -1,
            },
            populate: "*",
          });
        console.log("Find Card Items result", findResult);

        const { results: cartItems } = findResult as { results: any[] };

        const isValidItems =
          !!cartItems?.length &&
          isEqual(cartItems.map((item) => item.id).sort(), itemIds.sort());

        if (!isValidItems) {
          return ctx.badRequest("Invalid Cart Items");
        }

        const createResult: any = await strapi
          .service("api::order-detail.order-detail")
          .createOrderDetail({
            phoneNumber,
            email,
            items: cartItems,
            user,
          } as CreateOrderDetailArgs);

        const updateResult = strapi
          .service("api::order-detail.order-detail")
          .update(createResult.id, {
            data: {
              address,
            },
          });

        ctx.response.body = await that.sanitizeOutput(updateResult, ctx);
      } catch (error) {
        console.log("Something wrong", error);
        ctx.internalServerError(error);
      }
    },
  })
);
