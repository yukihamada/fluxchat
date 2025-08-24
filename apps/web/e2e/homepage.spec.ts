import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should display the FluxChat homepage', async ({ page }) => {
    await page.goto('/');
    
    // Check title
    await expect(page).toHaveTitle(/FluxChat/);
    
    // Check main heading
    await expect(page.locator('h1')).toContainText('FluxChat');
    
    // Check tagline
    await expect(page.locator('text=超高速・統合メッセージング')).toBeVisible();
    
    // Check features section
    await expect(page.locator('text=Features')).toBeVisible();
    await expect(page.locator('text=Real-time messaging')).toBeVisible();
    
    // Check navigation buttons
    const inboxLink = page.locator('text=Open Inbox');
    await expect(inboxLink).toBeVisible();
    
    const apiHealthLink = page.locator('text=Check API Health');
    await expect(apiHealthLink).toBeVisible();
  });

  test('should navigate to inbox', async ({ page }) => {
    await page.goto('/');
    
    // Click inbox link
    await page.click('text=Open Inbox');
    
    // Wait for navigation
    await page.waitForURL('/inbox');
    
    // Check inbox page loaded
    await expect(page.locator('h1')).toContainText('統合インボックス');
  });

  test('should check API health', async ({ page }) => {
    // Make API request
    const response = await page.request.get('http://localhost:8080/health');
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.status).toBe('ok');
    expect(data.version).toBeDefined();
  });
});