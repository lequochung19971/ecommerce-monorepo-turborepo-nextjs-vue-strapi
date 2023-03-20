const customRoute = {
  routes: [
    {
      method: "GET",
      path: "/categories/slug/:slug",
      handler: "category.findOneBySlug",
    },
  ],
};
export default customRoute;
