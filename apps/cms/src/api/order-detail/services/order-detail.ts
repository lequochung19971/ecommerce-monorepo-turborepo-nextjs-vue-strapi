/**
 * order-detail service
 */

import { factories } from "@strapi/strapi";
import {
  PaymentProvider,
  PaymentStatus,
  PaymentMethod,
  OrderItem,
  User,
} from "types";

export type CreateOrderDetailArgs = {
  phoneNumber: string;
  email: string;
  cardItems?: any[];
  orderItems?: Partial<OrderItem>[];
  user: object;
  payment: {
    provider?: PaymentProvider;
    method: PaymentMethod;
  };
  rider?: User;
};

export default factories.createCoreService(
  "api::order-detail.order-detail",
  ({ strapi }) => ({
    async createOrderDetail({
      cardItems = [],
      email,
      phoneNumber,
      user,
      payment,
      orderItems: orderItemsRequest = [],
      rider,
    }: CreateOrderDetailArgs) {
      return await strapi.db.transaction(async (transacting) => {
        try {
          const createOrderItems = async () => {
            const orderItemsPromises = (orderItemsRequest ?? cardItems).map(
              async (item) => {
                return strapi.query("api::order-item.order-item").create(
                  {
                    data: {
                      product: item.product,
                      quantity: item.quantity,
                    },
                  },
                  { transacting },
                );
              },
            );

            return await Promise.all(orderItemsPromises);
          };

          const removeCartItems = async () => {
            const deleteCartItemsPromises = cardItems.map(async (cartItem) => {
              return strapi.query("api::cart-item.cart-item").delete(
                {
                  where: {
                    id: cartItem.id,
                  },
                },
                { transacting },
              );
            });

            return await Promise.all(deleteCartItemsPromises);
          };

          const createPaymentDetail = async () => {
            return strapi.query("api::payment-detail.payment-detail").create({
              data: {
                ...payment,
                status: PaymentStatus.PENDING,
              },
            });
          };
          const orderItems = await createOrderItems();
          const paymentDetail = await createPaymentDetail();

          await removeCartItems();

          const orderDetail = await strapi
            .query("api::order-detail.order-detail")
            .create(
              {
                data: {
                  email,
                  orderItems,
                  phoneNumber,
                  user,
                  paymentDetail,
                  rider,
                },
              },
              { transacting },
            );

          transacting.commit();
          return orderDetail;
        } catch (error) {
          console.log("Fail to create order detail record", error);
          transacting.rollback();
          throw error;
        }
      });
    },
  }),
);
