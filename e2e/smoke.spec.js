import { expect, test } from '@playwright/test';

// While edited assumptions don't match any saved set, the assumptions
// selector shows a "Custom (unsaved)" entry — the current signal that custom
// values are active. (The old [title="Using custom values"] icon is gone.)
const customStateLabel = (page) => page.getByText('Custom (unsaved)');
const RECIPIENT_SEARCH_TOKEN = 'a';

// Custom assumptions persist in sessionStorage (see AssumptionsContext);
// calculator state persists in localStorage. Clear both for isolation.
const clearAppLocalStorage = async (page) => {
  await page.goto('/');
  await page.evaluate(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });
};

const saveCustomDiscountRate = async (page, nextValue) => {
  const discountRateInput = page.getByLabel('Discount Rate (%)');
  await discountRateInput.fill(nextValue);
  await page.getByRole('button', { name: 'Apply' }).click();

  await expect
    .poll(async () => {
      return page.evaluate(() => window.sessionStorage.getItem('customEffectsData'));
    })
    .not.toBeNull();
};

const hasRecipientCustomizations = async (page) => {
  return page.evaluate(() => {
    const raw = window.sessionStorage.getItem('customEffectsData');
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return !!parsed.recipients && Object.keys(parsed.recipients).length > 0;
  });
};

const hasCategoryCustomizations = async (page) => {
  return page.evaluate(() => {
    const raw = window.sessionStorage.getItem('customEffectsData');
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

    await expect(page.getByRole('heading', { name: 'Assumptions', exact: true })).toBeVisible();
    await expect(customStateLabel(page)).toHaveCount(0);

    const discountRateInput = page.getByLabel('Discount Rate (%)');
    const initialValue = await discountRateInput.inputValue();
    const newValue = initialValue === '3' ? '4' : '3';

    await saveCustomDiscountRate(page, newValue);

    const storedAssumptions = await page.evaluate(() => JSON.parse(window.sessionStorage.getItem('customEffectsData')));
    expect(storedAssumptions).toBeTruthy();
    expect(storedAssumptions.globalParameters.discountRate).toBe(Number(newValue) / 100);

    await expect(customStateLabel(page).first()).toBeVisible();
  });

  test('assumptions reset flow clears custom global parameter @smoke', async ({ page }) => {
    await clearAppLocalStorage(page);
    await page.goto('/assumptions');

    const discountRateInput = page.getByLabel('Discount Rate (%)');
    const defaultValue = await discountRateInput.inputValue();
    const newValue = defaultValue === '3' ? '4' : '3';

    await saveCustomDiscountRate(page, newValue);
    await expect(customStateLabel(page).first()).toBeVisible();

    await page.getByRole('button', { name: 'Reset Global' }).click();

    await expect(discountRateInput).toHaveValue(defaultValue);
    await expect
      .poll(async () => {
        return page.evaluate(() => window.sessionStorage.getItem('customEffectsData'));
      })
      .toBeNull();
    await expect(customStateLabel(page)).toHaveCount(0);
  });

  test('assumptions recipients flow supports override, disable, save, and reset @smoke', async ({ page }) => {
    await clearAppLocalStorage(page);
    await page.goto('/assumptions');

    await page.getByRole('tab', { name: 'Recipients' }).click();

    const recipientSearchInput = page.getByPlaceholder('Search recipients...');
    await recipientSearchInput.fill(RECIPIENT_SEARCH_TOKEN);
    const editButton = page.getByRole('button', { name: 'Edit' }).first();
    await expect(editButton).toBeVisible();
    await editButton.click();

    await expect(page.getByRole('heading', { name: /Edit effects for recipient/i })).toBeVisible();

    // Recipient edits are override-only in the current UI: fill the first
    // effect's cost field to create an override.
    const costInput = page.getByRole('textbox', { name: /Cost per life-year/i }).first();
    await expect(costInput).toBeVisible();
    await costInput.fill('123');

    await page.getByRole('button', { name: 'Disable effect' }).first().click();
    await expect(page.getByRole('button', { name: 'Enable effect' }).first()).toBeVisible();

    await page.getByRole('button', { name: 'Apply' }).click();
    await expect(page.getByRole('button', { name: 'Reset Recipients' })).toBeVisible();
    await expect.poll(() => hasRecipientCustomizations(page)).toBe(true);
    await expect(customStateLabel(page).first()).toBeVisible();

    await page.getByRole('button', { name: 'Reset Recipients' }).click();
    await expect
      .poll(async () => {
        return page.evaluate(() => window.sessionStorage.getItem('customEffectsData'));
      })
      .toBeNull();
    await expect(customStateLabel(page)).toHaveCount(0);
  });

  test('assumptions categories flow supports edit, save, and reset @smoke', async ({ page }) => {
    await clearAppLocalStorage(page);
    await page.goto('/assumptions');

    await page.getByRole('tab', { name: 'Causes' }).click();
    await page.getByRole('button', { name: 'Edit' }).first().click();

    await expect(page.getByRole('heading', { name: /Edit effects for cause/i })).toBeVisible();

    const categoryEffectInputs = page.locator('input[id^="effect-0-"]');
    await expect(categoryEffectInputs.first()).toBeVisible();
    await categoryEffectInputs.first().fill('1234');
    await categoryEffectInputs.nth(1).fill('3');

    // The category editor shows Apply in both its header and footer.
    await page.getByRole('button', { name: 'Apply' }).last().click();
    await expect(page.getByRole('button', { name: 'Reset Causes' })).toBeVisible();
    await expect.poll(() => hasCategoryCustomizations(page)).toBe(true);
    await expect(customStateLabel(page).first()).toBeVisible();

    await page.getByRole('button', { name: 'Reset Causes' }).click();
    await expect
      .poll(async () => {
        return page.evaluate(() => window.sessionStorage.getItem('customEffectsData'));
      })
      .toBeNull();
    await expect(customStateLabel(page)).toHaveCount(0);
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
    // The panel heading stays; the table (and its row actions) disappears.
    await expect(page.getByRole('heading', { name: 'Your Specific Donations' })).toBeVisible();
    await expect(page.getByTitle('Delete donation')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Add Specific Donation' })).toBeVisible();
    await expect
      .poll(async () => {
        return page.evaluate(() => JSON.parse(window.localStorage.getItem('specificDonations') || '[]').length);
      })
      .toBe(0);
  });
});
