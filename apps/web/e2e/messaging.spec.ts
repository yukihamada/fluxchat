import { test, expect } from '@playwright/test';

test.describe('Messaging', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/inbox');
    // Wait for page to be ready
    await page.waitForSelector('h1:has-text("統合インボックス")');
  });

  test('should display inbox page elements', async ({ page }) => {
    // Check header
    await expect(page.locator('h1')).toContainText('統合インボックス');
    await expect(page.locator('text=All your messages in one place')).toBeVisible();
    
    // Check connection status
    const connectionStatus = page.locator('text=Connected').or(page.locator('text=Disconnected'));
    await expect(connectionStatus).toBeVisible();
    
    // Check message input area
    await expect(page.locator('textarea[placeholder="Type your message..."]')).toBeVisible();
    await expect(page.locator('input[placeholder="Recipient"]')).toBeVisible();
    await expect(page.locator('button:has-text("Send")')).toBeVisible();
  });

  test('should send a message', async ({ page }) => {
    // Type recipient
    await page.fill('input[placeholder="Recipient"]', 'test-user');
    
    // Type message
    const messageContent = `Test message ${Date.now()}`;
    await page.fill('textarea[placeholder="Type your message..."]', messageContent);
    
    // Send message
    await page.click('button:has-text("Send")');
    
    // Wait for message to appear (if connected)
    // Note: This might not work without a running backend
    await page.waitForTimeout(1000);
    
    // Check if textarea is cleared
    await expect(page.locator('textarea[placeholder="Type your message..."]')).toHaveValue('');
  });

  test('should send message with Enter key', async ({ page }) => {
    // Type recipient and message
    await page.fill('input[placeholder="Recipient"]', 'test-user');
    await page.fill('textarea[placeholder="Type your message..."]', 'Quick message');
    
    // Press Enter to send
    await page.press('textarea[placeholder="Type your message..."]', 'Enter');
    
    // Check if textarea is cleared
    await expect(page.locator('textarea[placeholder="Type your message..."]')).toHaveValue('');
  });

  test('should not send empty message', async ({ page }) => {
    // Try to send without typing message
    const sendButton = page.locator('button:has-text("Send")');
    
    // Button should be disabled
    await expect(sendButton).toBeDisabled();
    
    // Type only spaces
    await page.fill('textarea[placeholder="Type your message..."]', '   ');
    
    // Button should still be disabled
    await expect(sendButton).toBeDisabled();
  });

  test('should allow multiline with Shift+Enter', async ({ page }) => {
    await page.fill('input[placeholder="Recipient"]', 'test-user');
    
    // Type first line
    await page.type('textarea[placeholder="Type your message..."]', 'Line 1');
    
    // Press Shift+Enter for new line
    await page.press('textarea[placeholder="Type your message..."]', 'Shift+Enter');
    
    // Type second line
    await page.type('textarea[placeholder="Type your message..."]', 'Line 2');
    
    // Check multiline content
    const textarea = page.locator('textarea[placeholder="Type your message..."]');
    const value = await textarea.inputValue();
    expect(value).toContain('Line 1\nLine 2');
  });
});