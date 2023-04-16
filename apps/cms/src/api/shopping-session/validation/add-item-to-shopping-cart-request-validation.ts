import Joi from "joi";

export const addItemToShoppingSessionRequestValidation = Joi.object({
  productId: Joi.number().required(),
});
