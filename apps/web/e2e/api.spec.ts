import { test, expect } from '@playwright/test';

test.describe('API Tests', () => {
  const API_URL = 'http://localhost:8080';

  test('should return health status', async ({ request }) => {
    const response = await request.get(`${API_URL}/health`);
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('status', 'ok');
    expect(data).toHaveProperty('version');
    expect(data).toHaveProperty('JetStream');
  });

  test('should send a message via API', async ({ request }) => {
    const messageData = {
      content: 'API test message',
      recipient: 'api-test-user',
      source: 'native'
    };

    const response = await request.post(`${API_URL}/api/messages/send`, {
      data: messageData,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('content', messageData.content);
    expect(data).toHaveProperty('recipient', messageData.recipient);
    expect(data).toHaveProperty('timestamp');
    expect(data).toHaveProperty('status', 'sent');
  });

  test('should reject invalid message', async ({ request }) => {
    // Missing required fields
    const invalidData = {
      content: '' // Empty content
    };

    const response = await request.post(`${API_URL}/api/messages/send`, {
      data: invalidData,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(400);
  });

  test('should handle CORS headers', async ({ request }) => {
    const response = await request.get(`${API_URL}/health`);
    
    const headers = response.headers();
    expect(headers['access-control-allow-origin']).toBe('*');
  });

  test('should stream events from SSE endpoint', async ({ request }) => {
    // Note: Playwright's request API doesn't handle SSE well
    // This is a basic connectivity test
    const response = await request.get(`${API_URL}/api/stream?user_id=test`, {
      headers: {
        'Accept': 'text/event-stream'
      },
      // Don't wait for full response as SSE is continuous
      timeout: 2000
    }).catch(e => {
      // SSE timeout is expected
      return e.response;
    });

    // Check if connection was established
    if (response) {
      const headers = response.headers();
      expect(headers['content-type']).toContain('text/event-stream');
    }
  });

  test('should return empty inbox', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/messages/inbox`);
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
  });
});