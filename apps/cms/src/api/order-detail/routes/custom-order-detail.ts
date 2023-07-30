const customRoute = {
  routes: [
    {
      method: "POST",
      path: "/order-details/paypal-order-capture",
      handler: "order-detail.capturePaypalOrder",
    },
    {
      method: "POST",
      path: "/order-details/paypal-order-creation",
      handler: "order-detail.createPaypalOrder",
    },
  ],
};
export default customRoute;
