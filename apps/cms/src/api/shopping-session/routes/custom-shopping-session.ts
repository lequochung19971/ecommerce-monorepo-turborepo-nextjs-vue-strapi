const customRoute = {
  routes: [
    {
      method: "POST",
      path: "/shopping-session/cart",
      handler: "shopping-session.addItemToShoppingSession",
    },
    {
      method: "GET",
      path: "/shopping-session/items-quantity",
      handler: "shopping-session.getShoppingSessionItemsQuantity",
    },
  ],
};
export default customRoute;
