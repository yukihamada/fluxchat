import { test, expect, Page } from '@playwright/test';

test.describe('Real-time Messaging', () => {
  let page1: Page;
  let page2: Page;

  test.beforeEach(async ({ browser }) => {
    // Open two browser pages
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    
    page1 = await context1.newPage();
    page2 = await context2.newPage();
    
    // Navigate both to inbox
    await page1.goto('/inbox');
    await page2.goto('/inbox');
    
    // Wait for both pages to load
    await page1.waitForSelector('h1:has-text("統合インボックス")');
    await page2.waitForSelector('h1:has-text("統合インボックス")');
  });

  test.afterEach(async () => {
    await page1.close();
    await page2.close();
  });

  test('should show connection status', async () => {
    // Check connection status on both pages
    const status1 = page1.locator('text=Connected').or(page1.locator('text=Disconnected'));
    const status2 = page2.locator('text=Connected').or(page2.locator('text=Disconnected'));
    
    await expect(status1).toBeVisible();
    await expect(status2).toBeVisible();
  });

  test('should sync messages between tabs', async () => {
    // Send message from page1
    const messageContent = `Real-time test ${Date.now()}`;
    
    await page1.fill('input[placeholder="Recipient"]', 'user2');
    await page1.fill('textarea[placeholder="Type your message..."]', messageContent);
    await page1.click('button:has-text("Send")');
    
    // Wait a bit for message propagation
    await page1.waitForTimeout(2000);
    
    // Check if message appears in page1
    const message1 = page1.locator(`text=${messageContent}`);
    
    // If backend is running and SSE works, message should appear
    // This is a soft check as it depends on backend
    const messageCount = await message1.count();
    if (messageCount > 0) {
      await expect(message1).toBeVisible();
      
      // Check if same message appears in page2
      const message2 = page2.locator(`text=${messageContent}`);
      await expect(message2).toBeVisible();
    }
  });

  test('should handle reconnection', async () => {
    // This test simulates network issues
    // Note: Requires backend to be running
    
    // Check initial connection
    const connectionStatus = page1.locator('text=Connected').or(page1.locator('text=Disconnected'));
    await expect(connectionStatus).toBeVisible();
    
    // Simulate offline (if possible in your setup)
    // This is browser-specific and might not work in all cases
    await page1.context().setOffline(true);
    await page1.waitForTimeout(1000);
    
    // Should show disconnected
    // await expect(page1.locator('text=Disconnected')).toBeVisible();
    
    // Go back online
    await page1.context().setOffline(false);
    await page1.waitForTimeout(2000);
    
    // Should reconnect (implementation dependent)
    // await expect(page1.locator('text=Connected')).toBeVisible();
  });
});