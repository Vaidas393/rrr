import { Page, Locator } from '@playwright/test';
import * as testData from '../data/testData.json';

export class WorkflowPage {
  constructor(private page: Page) {}
  
  // Locators as getters
  get hamburgerMenuToggle() { return this.page.locator('[data-test="hamburger-menu-toggle"]'); }
  get categoryVarikliai() { return this.page.locator('[data-test="category-varikliai"]'); }
  categoryByName(categoryName: string) { return this.page.locator(`[data-test="category-${categoryName.toLowerCase()}"]`); }
  get productCard1() { return this.page.locator('[data-test="product-card-1"]'); }
  get cartLink() { return this.page.getByRole('link', { name: ' Krepšelis' }); }
  get checkoutLink() { return this.page.getByRole('link', { name: /Pirkti/ }); }
  get guestCheckoutHeading() { return this.page.getByRole('heading', { name: ' Pirkti neprisijungus' }); }
  get continueButton() { return this.page.getByRole('button', { name: 'Tęsti ' }); }
  get firstNameInput() { return this.page.getByRole('textbox', { name: 'Vardas *' }); }
  get lastNameInput() { return this.page.getByRole('textbox', { name: 'Pavardė *' }); }
  get emailInput() { return this.page.getByRole('textbox', { name: 'El. paštas *' }); }
  get phoneInput() { return this.page.getByRole('textbox', { name: 'Telefono numeris *' }); }
  get citySelect() { return this.page.getByLabel('Miestas *'); }
  get postalCodeInput() { return this.page.getByRole('textbox', { name: 'Pašto kodas *' }); }
  get addressInput() { return this.page.getByRole('textbox', { name: 'Adresas *' }); }
  get pickupOption() { return this.page.getByText('Atsiėmimas vietoje Tuoj pat Nemokama'); }
  get clearCartButton() { return this.page.getByRole('button', { name: 'Išvalyti krepšelį' }); }

  async executeCompleteWorkflow(): Promise<void> {
    const data = testData.testData;
    
    // Navigate to homepage
    await this.page.goto('https://vpsocial.site/');
    await this.page.waitForLoadState('networkidle');
    
    // Click hamburger menu to open categories
    await this.hamburgerMenuToggle.click();
    await this.categoryByName(data.category).click();
    
    // Add first product to cart
    await this.productCard1.getByRole('button', { name: ' Į krepšelį' }).click();
    
    // Go to cart
    await this.cartLink.click();
    
    // Start checkout
    await this.checkoutLink.click();
    
    // Select login type (guest)
    await this.guestCheckoutHeading.click();
    await this.continueButton.click();
    
    // Fill address form
    await this.firstNameInput.fill(data.user.firstName);
    await this.lastNameInput.fill(data.user.lastName);
    await this.emailInput.fill(data.user.email);
    await this.phoneInput.fill(data.user.phone);
    await this.citySelect.selectOption(data.user.address.city);
    await this.postalCodeInput.fill(data.user.address.postalCode);
    await this.addressInput.fill(data.user.address.street);
    await this.continueButton.click();
    
    // Select delivery method
    await this.pickupOption.click();
    
    // Go back to cart and clear it
    await this.cartLink.click();
    await this.clearCartButton.click();
  }
}