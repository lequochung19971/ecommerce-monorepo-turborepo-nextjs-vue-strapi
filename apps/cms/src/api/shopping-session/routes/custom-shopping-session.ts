const customRoute = {
  routes: [
    {
      method: "POST",
      path: "/shopping-session/shopping-cart",
      handler: "shopping-session.addItemToShoppingSession",
    },
  ],
};
export default customRoute;
