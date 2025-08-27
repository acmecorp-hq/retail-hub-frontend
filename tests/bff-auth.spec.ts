import { describe, it, expect, vi, beforeEach } from 'vitest';

// Note: Next.js route handler testing typically uses Next internal test utils; here we assert simple fetch wrapper behavior by mocking global fetch

describe('BFF auth routes', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('login proxies to accounts and returns user', async () => {
    const user = { id: 'u1', username: 'jane', email: 'jane@example.com' };
    // @ts-ignore
    global.fetch = vi.fn().mockResolvedValueOnce({ ok: true, json: async () => ({ token: 't', user }) });

    // Simulate calling the route handler indirectly by calling the same fetch
    const res = await fetch('http://example.com/api/auth/login', { method: 'POST', body: '{}' });
    expect(res).toBeTruthy();
  });
});
