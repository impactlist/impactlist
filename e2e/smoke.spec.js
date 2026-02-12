import { expect, test } from '@playwright/test';

const CUSTOM_VALUES_INDICATOR = '[title="Using custom values"]';
const RECIPIENT_SEARCH_TOKEN = 'a';

const clearAppLocalStorage = async (page) => {
  await page.goto('/');
  await page.evaluate(() => {
    window.localStorage.clear();
  });
};

const saveCustomDiscountRate = async (page, nextValue) => {
  const discountRateInput = page.getByLabel('Discount Rate (%)');
  await discountRateInput.fill(nextValue);
  await page.getByRole('button', { name: 'Save' }).click();

  await expect
    .poll(async () => {
      return page.evaluate(() => window.localStorage.getItem('customEffectsData'));
    })
    .not.toBeNull();
};

const hasRecipientCustomizations = async (page) => {
  return page.evaluate(() => {
    const raw = window.localStorage.getItem('customEffectsData');
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return !!parsed.recipients && Object.keys(parsed.recipients).length > 0;
  });
};

const hasCategoryCustomizations = async (page) => {
  return page.evaluate(() => {
    const raw = window.localStorage.getItem('customEffectsData');
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return !!parsed.categories && Object.keys(parsed.categories).length > 0;
  });
};

test.describe('Critical path smoke tests', () => {
  test('donation calculator input + reset flow @smoke', async ({ page }) => {
    await clearAppLocalStorage(page);
    await page.goto('/calculator');

    await expect(page.getByRole('heading', { name: 'Donation Calculator' })).toBeVisible();

    const totalDonatedValue = page.getByTestId('calculator-total-donated-value');
    const livesSavedValue = page.getByTestId('calculator-lives-saved-value');
    const costPerLifeValue = page.getByTestId('calculator-cost-per-life-value');

    const initialLivesSavedText = (await livesSavedValue.innerText()).trim();
    const initialCostPerLifeText = (await costPerLifeValue.innerText()).trim();

    const firstDonationInput = page.locator('input[id^="donation-"]').first();
    await firstDonationInput.fill('1000');

    await expect(firstDonationInput).toHaveValue(/1,?000/);
    await expect(totalDonatedValue).toContainText('$1,000');
    await expect
      .poll(async () => {
        return (await livesSavedValue.innerText()).trim();
      })
      .not.toBe(initialLivesSavedText);
    await expect
      .poll(async () => {
        return (await costPerLifeValue.innerText()).trim();
      })
      .not.toBe(initialCostPerLifeText);

    await page.getByRole('button', { name: 'Reset All Amounts' }).click();
    await expect(firstDonationInput).toHaveValue('');
    await expect(totalDonatedValue).toContainText('$0');
    await expect(livesSavedValue).toContainText(initialLivesSavedText);
    await expect(costPerLifeValue).toContainText(initialCostPerLifeText);
  });

  test('assumptions edit flow persists custom global parameter @smoke', async ({ page }) => {
    await clearAppLocalStorage(page);
    await page.goto('/assumptions');

    await expect(page.getByRole('heading', { name: 'Assumptions' })).toBeVisible();
    await expect(page.locator(CUSTOM_VALUES_INDICATOR)).toHaveCount(0);

    const discountRateInput = page.getByLabel('Discount Rate (%)');
    const initialValue = await discountRateInput.inputValue();
    const newValue = initialValue === '3' ? '4' : '3';

    await saveCustomDiscountRate(page, newValue);

    const storedAssumptions = await page.evaluate(() => JSON.parse(window.localStorage.getItem('customEffectsData')));
    expect(storedAssumptions).toBeTruthy();
    expect(storedAssumptions.globalParameters.discountRate).toBe(Number(newValue) / 100);

    await expect(page.locator(CUSTOM_VALUES_INDICATOR)).toHaveCount(1);
  });

  test('assumptions reset flow clears custom global parameter @smoke', async ({ page }) => {
    await clearAppLocalStorage(page);
    await page.goto('/assumptions');

    const discountRateInput = page.getByLabel('Discount Rate (%)');
    const defaultValue = await discountRateInput.inputValue();
    const newValue = defaultValue === '3' ? '4' : '3';

    await saveCustomDiscountRate(page, newValue);
    await expect(page.locator(CUSTOM_VALUES_INDICATOR)).toHaveCount(1);

    await page.getByRole('button', { name: 'Reset Global' }).click();

    await expect(discountRateInput).toHaveValue(defaultValue);
    await expect
      .poll(async () => {
        return page.evaluate(() => window.localStorage.getItem('customEffectsData'));
      })
      .toBeNull();
    await expect(page.locator(CUSTOM_VALUES_INDICATOR)).toHaveCount(0);
  });

  test('assumptions recipients flow supports override, multiplier, disable, save, and reset @smoke', async ({
    page,
  }) => {
    await clearAppLocalStorage(page);
    await page.goto('/assumptions');

    await page.getByRole('button', { name: 'Recipients' }).click();

    const recipientSearchInput = page.getByPlaceholder('Search recipients...');
    await recipientSearchInput.fill(RECIPIENT_SEARCH_TOKEN);
    const editButton = page.getByRole('button', { name: 'Edit' }).first();
    await expect(editButton).toBeVisible();
    await editButton.click();

    await expect(page.getByRole('heading', { name: /Edit effects for recipient/i })).toBeVisible();

    const recipientInputs = page.locator('[data-testid^="recipient-effect-input-0-"]');
    await expect(recipientInputs.first()).toBeVisible();
    await recipientInputs.first().fill('123');

    // Use the second field's mode toggle to validate multiplier path in a way that's independent
    // from the first override field.
    const multiplierButtons = page.locator('[data-testid^="recipient-effect-mode-0-"][data-testid$="-multiplier"]');
    await expect(multiplierButtons.nth(1)).toBeVisible();
    await multiplierButtons.nth(1).click();
    await recipientInputs.nth(1).fill('1.5');

    await page.getByRole('button', { name: 'Disable effect' }).first().click();
    await expect(page.getByRole('button', { name: 'Enable effect' }).first()).toBeVisible();

    await page.getByRole('button', { name: 'Save Changes' }).click();
    await expect(page.getByRole('button', { name: 'Reset Recipients' })).toBeVisible();
    await expect.poll(() => hasRecipientCustomizations(page)).toBe(true);
    await expect(page.locator(CUSTOM_VALUES_INDICATOR)).toHaveCount(1);

    await page.getByRole('button', { name: 'Reset Recipients' }).click();
    await expect
      .poll(async () => {
        return page.evaluate(() => window.localStorage.getItem('customEffectsData'));
      })
      .toBeNull();
    await expect(page.locator(CUSTOM_VALUES_INDICATOR)).toHaveCount(0);
  });

  test('assumptions categories flow supports edit, save, and reset @smoke', async ({ page }) => {
    await clearAppLocalStorage(page);
    await page.goto('/assumptions');

    await page.getByRole('button', { name: 'Categories' }).click();
    await page.getByRole('button', { name: 'Edit' }).first().click();

    await expect(page.getByRole('heading', { name: /Edit effects for category/i })).toBeVisible();

    const categoryEffectInputs = page.locator('input[id^="effect-0-"]');
    await expect(categoryEffectInputs.first()).toBeVisible();
    await categoryEffectInputs.first().fill('1234');
    await categoryEffectInputs.nth(1).fill('3');

    await page.getByRole('button', { name: 'Save Changes' }).click();
    await expect(page.getByRole('button', { name: 'Reset Categories' })).toBeVisible();
    await expect.poll(() => hasCategoryCustomizations(page)).toBe(true);
    await expect(page.locator(CUSTOM_VALUES_INDICATOR)).toHaveCount(1);

    await page.getByRole('button', { name: 'Reset Categories' }).click();
    await expect
      .poll(async () => {
        return page.evaluate(() => window.localStorage.getItem('customEffectsData'));
      })
      .toBeNull();
    await expect(page.locator(CUSTOM_VALUES_INDICATOR)).toHaveCount(0);
  });

  test('specific donations modal supports add/edit/delete with persistence @smoke', async ({ page }) => {
    await clearAppLocalStorage(page);
    await page.goto('/calculator');

    const totalDonatedValue = page.getByTestId('calculator-total-donated-value');
    await expect(totalDonatedValue).toContainText('$0');

    await page.getByRole('button', { name: 'Add Specific Donation' }).click();
    const modal = page.getByTestId('specific-donation-modal');
    await expect(modal).toBeVisible();

    const recipientSearch = modal.getByLabel('Search for a recipient');
    await recipientSearch.fill(RECIPIENT_SEARCH_TOKEN);
    const firstRecipientOption = modal.getByRole('option').first();
    await expect(firstRecipientOption).toBeVisible();
    const selectedRecipientName = (await firstRecipientOption.innerText()).trim();
    await firstRecipientOption.click();

    await modal.getByLabel('Donation Amount').fill('1234');
    await modal.getByLabel('Year').fill('2020');
    await modal.getByRole('button', { name: 'Add Donation' }).click();

    await expect(page.getByRole('heading', { name: 'Your Specific Donations' })).toBeVisible();
    await expect(totalDonatedValue).toContainText('$1,234');
    await expect(page.getByText(selectedRecipientName).first()).toBeVisible();
    await expect
      .poll(async () => {
        return page.evaluate(() => JSON.parse(window.localStorage.getItem('specificDonations') || '[]').length);
      })
      .toBe(1);

    await page.reload();
    await expect(totalDonatedValue).toContainText('$1,234');
    await expect(page.getByRole('heading', { name: 'Your Specific Donations' })).toBeVisible();

    await page.getByTitle('Edit donation').first().click();
    const editModal = page.getByTestId('specific-donation-modal');
    await expect(editModal.getByRole('heading', { name: 'Edit Donation' })).toBeVisible();
    await editModal.getByLabel('Donation Amount').fill('1500');
    await editModal.getByRole('button', { name: 'Update Donation' }).click();

    await expect(totalDonatedValue).toContainText('$1,500');
    await expect
      .poll(async () => {
        return page.evaluate(() => {
          const stored = JSON.parse(window.localStorage.getItem('specificDonations') || '[]');
          return stored[0]?.amount ?? null;
        });
      })
      .toBe(1500);

    await page.reload();
    await expect(totalDonatedValue).toContainText('$1,500');

    await page.getByTitle('Delete donation').first().click();
    await expect(totalDonatedValue).toContainText('$0');
    await expect(page.getByRole('heading', { name: 'Your Specific Donations' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Add Specific Donation' })).toBeVisible();
    await expect
      .poll(async () => {
        return page.evaluate(() => JSON.parse(window.localStorage.getItem('specificDonations') || '[]').length);
      })
      .toBe(0);
  });
});
