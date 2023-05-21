/**
 * shopping-session service
 */

import { factories } from "@strapi/strapi";

type AddItemToShoppingSessionArgs = {
  user: any;
  product: any;
};
export default factories.createCoreService(
  "api::shopping-session.shopping-session",
  ({ strapi }) => ({
    async addItemToShoppingSession(args: AddItemToShoppingSessionArgs) {
      let { product, user } = args;
      try {
        let shoppingSession = await strapi.db
          .query("api::shopping-session.shopping-session")
          .findOne({
            where: {
              user: {
                id: user.id,
              },
            },
          });

        return await strapi.db.connection.transaction(async (transacting) => {
          try {
            // If there is no shopping session, will create a new one and add the first item
            if (!shoppingSession) {
              shoppingSession = await strapi
                .query("api::shopping-session.shopping-session")
                .create(
                  {
                    data: {
                      user,
                    },
                  },
                  { transacting }
                );
              await strapi.query("api::cart-item.cart-item").create(
                {
                  data: {
                    shopping_session: shoppingSession,
                    product,
                    quantity: 1,
                  },
                },
                { transacting }
              );
            } else {
              let cartItem = await strapi.db
                .query("api::cart-item.cart-item")
                .findOne({
                  where: {
                    product: {
                      id: product.id,
                    },
                    shopping_session: {
                      id: shoppingSession?.id,
                    },
                  },
                });

              if (cartItem) {
                cartItem = await strapi
                  .query("api::cart-item.cart-item")
                  .update(
                    {
                      where: { id: cartItem.id },
                      data: {
                        quantity: cartItem.quantity + 1,
                      },
                    },

                    { transacting }
                  );
              } else {
                cartItem = await strapi
                  .query("api::cart-item.cart-item")
                  .create(
                    {
                      data: {
                        shopping_session: shoppingSession,
                        product,
                        quantity: 1,
                      },
                    },

                    { transacting }
                  );
              }
            }

            await transacting.commit();
          } catch (error) {
            await transacting.rollback();
            return error;
          }
        });
      } catch (error) {
        throw error;
      }
    },
  })
);
