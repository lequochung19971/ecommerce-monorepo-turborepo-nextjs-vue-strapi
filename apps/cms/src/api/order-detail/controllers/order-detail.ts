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
        const { user: currentUser } = ctx.state;

        if (!currentUser) {
          return ctx.notFound("User is not found");
        }

        const {
          itemIds = [],
          address,
          phoneNumber,
          email,
          payment,
          user,
          orderItems = [],
          rider,
        } = ctx.request.body as CreateOrderDetailRequest;

        let cartItems = [];

        if (itemIds?.length) {
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

          cartItems = (findResult as { results: any[] }).results;

          const isValidItems =
            !!cartItems?.length &&
            isEqual(cartItems.map((item) => item.id).sort(), itemIds.sort());

          if (!isValidItems) {
            return ctx.badRequest("Invalid Cart Items");
          }
        }

        const createResult: any = await strapi
          .service("api::order-detail.order-detail")
          .createOrderDetail({
            phoneNumber,
            email,
            items: cartItems,
            user: user ?? currentUser,
            orderItems,
            payment,
            rider,
          } as CreateOrderDetailArgs);

        const updateResult = await strapi
          .service("api::order-detail.order-detail")
          .update(createResult.id, {
            data: {
              address,
            },
          });
        ctx.response.body = await that.sanitizeOutput(updateResult, ctx);
      } catch (error) {
        ctx.internalServerError(error);
      }
    },
    async capturePaypalOrder(ctx) {
      const that = this as Controller;
      const { user } = ctx.state;

      if (!user) {
        return ctx.notFound("User is not found");
      }

      const { orderDetailId, paypalOrderId } = ctx.request.body;

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

      if (!user) {
        return ctx.notFound("User is not found");
      }

      const { cartItemIds } = ctx.request.body as { cartItemIds: string[] };
      const cartItems: any = await strapi
        .service("api::cart-item.cart-item")
        .find({
          where: cartItemIds,
          populate: "*",
        });
      const totalCost = (cartItems.results as any[]).reduce((total, cart) => {
        total = total + +cart.product.price * cart.quantity;
        return total;
      }, 0);
      const createPaypalResponse = await paypal.createOrder({
        totalCost,
      });
      ctx.response.body = createPaypalResponse;
    },
  }),
);
