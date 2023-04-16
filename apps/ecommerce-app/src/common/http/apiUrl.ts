export enum ApiUrl {
  AUTH_LOCAL = '/api/auth/local',
  AUTH_LOCAL_REGISTER = '/api/auth/local/register',
  AUTH_LOCAL_PASSWORD = '/api/auth/forgot-password',
  AUTH_RESET_PASSWORD = '/api/auth/reset-password',
  AUTH_GOOGLE_CALLBACK = '/api/auth/google/callback',
  AUTH_GITHUB_CALLBACK = '/api/auth/github/callback',

  PRODUCTS = '/api/products',
  CATEGORIES = '/api/categories',
  CATEGORIES_SLUG = '/api/categories/slug',

  SHOPPING_SESSION_CART = '/api/shopping-session/cart',
  SHOPPING_SESSION_ITEMS_QUANTITY = '/api/shopping-session/items-quantity',
  CART_ITEMS = '/api/cart-items',
}
