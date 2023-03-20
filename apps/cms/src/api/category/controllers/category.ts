/**
 * category controller
 */

import { factories } from "@strapi/strapi";
import { Controller } from "@strapi/strapi/lib/core-api/controller";

export default factories.createCoreController(
  "api::category.category",
  ({ strapi }) => ({
    async findOneBySlug(ctx) {
      const that = this as Controller;
      const { slug } = ctx.params;
      const entry = await strapi.db.query("api::category.category").findOne({
        where: { slug },
      });
      ctx.response.body = await that.sanitizeOutput(entry, ctx);
    },
  })
);
