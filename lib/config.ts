export const appConfig = {
  siteBaseUrl: process.env.NEXT_PUBLIC_SITE_BASE_URL || 'http://localhost:3000',
  accountsBaseUrl: process.env.ACCOUNTS_BASE_URL || 'http://localhost:8080/v1/accounts',
  catalogBaseUrl: process.env.CATALOG_BASE_URL || 'http://localhost:8081/v1/catalog',
  cartBaseUrl: process.env.CART_BASE_URL || 'http://localhost:8082/v1/cart',
  ordersBaseUrl: process.env.ORDERS_BASE_URL || 'http://localhost:8083/v1/orders',
  paymentsBaseUrl: process.env.PAYMENTS_BASE_URL || 'http://localhost:8084/v1/payments',
  reportsBaseUrl: process.env.REPORTS_BASE_URL || 'http://localhost:8085/v1/reports',
  sessionCookieName: process.env.SESSION_COOKIE_NAME || 'rh_session',
  sessionMaxAge: Number(process.env.SESSION_MAX_AGE || '86400'),
};
