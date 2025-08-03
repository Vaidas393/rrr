import { test, expect } from '@playwright/test';
import { WorkflowPage } from '../pages/WorkflowPage';

test('Run workflow method and verify empty cart', async ({ page }) => {
  const workflowPage = new WorkflowPage(page);
  
  // Call the method
  await workflowPage.executeCompleteWorkflow();
  
  // Do the assertion
  await expect(page.locator('h4:has-text("tuščias")')).toBeVisible();
  await expect(page.locator('#empty-cart-message')).toBeVisible();
});
