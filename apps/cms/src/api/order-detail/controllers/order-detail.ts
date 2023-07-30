/**
 * order-detail controller
 */

import { factories } from "@strapi/strapi";
import { Controller } from "@strapi/strapi/lib/core-api/controller";
import { isEqual } from "lodash";
import { CreateOrderDetailRequest, PaymentStatus } from "types";
import { CreateOrderDetailArgs } from "../services/order-detail";
import * as paypal from "./paypal-api";

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

        const { itemIds, address, phoneNumber, email, payment } = ctx.request
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
            payment,
          } as CreateOrderDetailArgs);

        console.log("createResult", createResult);
        const updateResult = await strapi
          .service("api::order-detail.order-detail")
          .update(createResult.id, {
            data: {
              address,
            },
          });
        console.log("updateResult", updateResult);
        ctx.response.body = await that.sanitizeOutput(updateResult, ctx);
      } catch (error) {
        console.log("Something wrong", error);
        ctx.internalServerError(error);
      }
    },
    async capturePaypalOrder(ctx) {
      const that = this as Controller;
      const { user } = ctx.state;

      console.log("Request", ctx.request.body);

      if (!user) {
        return ctx.notFound("User is not found");
      }

      const { orderDetailId, paypalOrderId } = ctx.request.body;
      console.log("orderDetailId", orderDetailId);
      console.log("paypalOrderId", paypalOrderId);

      const orderDetail = await strapi
        .service("api::order-detail.order-detail")
        .findOne(orderDetailId, {
          populate: {
            paymentDetail: {
              populate: "*",
            },
          },
        });

      const { paymentDetail } = orderDetail;

      const captureResponse = await paypal.capturePayment(paypalOrderId);
      console.log(captureResponse);
      await strapi
        .service("api::payment-detail.payment-detail")
        .update(paymentDetail.id, {
          data: {
            status: PaymentStatus.PAID,
            extraInfo: JSON.stringify(captureResponse),
          },
        });
      ctx.response.body = captureResponse;
    },
    async createPaypalOrder(ctx) {
      const that = this as Controller;
      const { user } = ctx.state;

      console.log("Request", ctx.request.body);

      if (!user) {
        return ctx.notFound("User is not found");
      }

      const { cartItemIds } = ctx.request.body as { cartItemIds: string[] };
      console.log("orderId", cartItemIds);
      const cartItems: any = await strapi
        .service("api::cart-item.cart-item")
        .find({
          where: cartItemIds,
          populate: "*",
        });
      console.log("cartItems", cartItems);
      const totalCost = (cartItems.results as any[]).reduce((total, cart) => {
        total = total + +cart.product.price * cart.quantity;
        return total;
      }, 0);
      const createPaypalResponse = await paypal.createOrder({
        totalCost,
      });
      console.log("createPaypalResponse", createPaypalResponse);
      ctx.response.body = createPaypalResponse;
    },
  })
);
