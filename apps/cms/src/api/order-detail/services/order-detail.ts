/**
 * order-detail service
 */

import { factories } from "@strapi/strapi";
import { Address } from "types";

export type CreateOrderDetailArgs = {
  phoneNumber: string;
  email: string;
  items: any[];
  user: object;
};

export default factories.createCoreService(
  "api::order-detail.order-detail",
  ({ strapi }) => ({
    async createOrderDetail({
      items,
      email,
      phoneNumber,
      user,
    }: CreateOrderDetailArgs) {
      return await strapi.db.transaction(async (transacting) => {
        try {
          const createOrderItems = async () => {
            const orderItemsPromises = items.map(async (cartItem) => {
              return strapi.query("api::order-item.order-item").create(
                {
                  data: {
                    product: cartItem.product,
                    quantity: cartItem.quantity,
                  },
                },
                { transacting }
              );
            });

            return await Promise.all(orderItemsPromises);
          };

          const removeCartItems = async () => {
            const deleteCartItemsPromises = items.map(async (cartItem) => {
              return strapi.query("api::cart-item.cart-item").delete(
                {
                  where: {
                    id: cartItem.id,
                  },
                },
                { transacting }
              );
            });

            return await Promise.all(deleteCartItemsPromises);
          };

          const orderItems = await createOrderItems();
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
                },
              },
              { transacting }
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
  })
);
