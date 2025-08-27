import { appConfig } from './config';
import { generateRequestId } from './request-id';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface FetchJsonOptions<TBody = unknown> {
  method?: HttpMethod;
  body?: TBody;
  headers?: Record<string, string>;
  idempotent?: boolean;
  next?: { revalidate?: number };
}

export async function fetchJson<TResp, TBody = unknown>(
  url: string,
  options: FetchJsonOptions<TBody> = {},
): Promise<TResp> {
  const requestId = generateRequestId();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Request-Id': requestId,
    ...options.headers,
  };

  const res = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: 'no-store',
    next: options.next,
  });

  if (!res.ok) {
    let problem: any;
    try {
      problem = await res.json();
    } catch {
      problem = { title: res.statusText, status: res.status };
    }
    throw Object.assign(new Error(problem.detail || res.statusText), { problem, status: res.status });
  }

  if (res.status === 204) {
    // @ts-expect-error allow void
    return undefined;
  }

  return res.json() as Promise<TResp>;
}

export const serviceBase = {
  accounts: appConfig.accountsBaseUrl,
  catalog: appConfig.catalogBaseUrl,
  cart: appConfig.cartBaseUrl,
  orders: appConfig.ordersBaseUrl,
  payments: appConfig.paymentsBaseUrl,
  reports: appConfig.reportsBaseUrl,
};
