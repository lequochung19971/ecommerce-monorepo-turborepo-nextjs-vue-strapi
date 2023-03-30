import Joi from "joi";

export const addItemToShoppingSessionRequestValidation = Joi.object({
  userId: Joi.string().required(),
  productId: Joi.string().required(),
});
