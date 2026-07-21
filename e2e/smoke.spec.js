import { expect, test } from '@playwright/test';

// While edited assumptions don't match any named set, the assumptions
// selector shows a custom entry — the current signal that custom values are
// active. (The old [title="Using custom values"] icon is gone.)
const customStateLabel = (page) => page.getByText('Custom (unnamed)');
const discountRateField = (page) => page.getByRole('textbox', { name: 'Discount Rate (%)' });
const ACTIVE_APPLIED_ASSUMPTIONS_KEY = 'activeAppliedAssumptions:v1';
const RECIPIENT_SEARCH_TOKEN = 'a';

// Applied custom assumptions and calculator state persist in localStorage;
// the former sessionStorage value remains only as a migration/fallback mirror.
// Clear both storage areas for isolation.
const clearAppLocalStorage = async (page) => {
  await page.goto('/');
  await page.evaluate(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });
};

const getDurableAppliedAssumptionsRaw = (page) =>
  page.evaluate((key) => window.localStorage.getItem(key), ACTIVE_APPLIED_ASSUMPTIONS_KEY);

const getDurableAppliedAssumptions = async (page) => {
  const raw = await getDurableAppliedAssumptionsRaw(page);
  return raw ? JSON.parse(raw) : null;
};

const saveCustomDiscountRate = async (page, nextValue) => {
  const discountRateInput = discountRateField(page);
  await discountRateInput.fill(nextValue);
  await page.getByRole('button', { name: 'Apply' }).click();

  await expect.poll(() => getDurableAppliedAssumptions(page)).not.toBeNull();
};

const hasRecipientCustomizations = async (page) => {
  const persisted = await getDurableAppliedAssumptions(page);
  return !!persisted?.recipients && Object.keys(persisted.recipients).length > 0;
};

const hasCategoryCustomizations = async (page) => {
  const persisted = await getDurableAppliedAssumptions(page);
  return !!persisted?.categories && Object.keys(persisted.categories).length > 0;
};

const addSpecificDonation = async (page, { amount = '1234', year = '2020' } = {}) => {
  await page.getByRole('button', { name: 'Add Specific Donation' }).click();
  const modal = page.getByTestId('specific-donation-modal');
  await expect(modal).toBeVisible();

  const recipientSearch = modal.getByLabel('Search for a recipient');
  await recipientSearch.fill(RECIPIENT_SEARCH_TOKEN);
  const firstRecipientOption = modal.getByRole('option').first();
  await expect(firstRecipientOption).toBeVisible();
  const selectedRecipientName = (await firstRecipientOption.innerText()).trim();
  await firstRecipientOption.click();

  await modal.getByLabel('Donation Amount').fill(amount);
  await modal.getByLabel('Year').fill(year);
  await modal.getByRole('button', { name: 'Add Donation' }).click();
  await expect(modal).not.toBeVisible();

  return selectedRecipientName;
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

    // Unsupported notation must be rejected as a whole. It previously lost
    // the `e` and silently turned `1e309` into the very different `$1,309`.
    await firstDonationInput.fill('1e309');
    await expect(firstDonationInput).toHaveValue('1e309');
    await expect(firstDonationInput).toHaveAttribute('aria-invalid', 'true');
    await expect(page.getByText('Enter a positive finite amount using decimal or scientific notation.')).toBeVisible();
    await expect(totalDonatedValue).toContainText('$0');

    await firstDonationInput.fill('');
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

    const discountRateInput = discountRateField(page);
    const initialValue = await discountRateInput.inputValue();
    const newValue = initialValue === '3' ? '4' : '3';

    await saveCustomDiscountRate(page, newValue);

    const storedAssumptions = await getDurableAppliedAssumptions(page);
    expect(storedAssumptions).toBeTruthy();
    expect(storedAssumptions.globalParameters.discountRate).toBe(Number(newValue) / 100);

    await expect(customStateLabel(page).first()).toBeVisible();
  });

  test('applied assumptions survive losing the tab session and reloading @smoke', async ({ page }) => {
    await clearAppLocalStorage(page);
    await page.goto('/assumptions');

    const discountRateInput = discountRateField(page);
    const defaultValue = await discountRateInput.inputValue();
    const newValue = defaultValue === '3' ? '4' : '3';

    await saveCustomDiscountRate(page, newValue);
    await page.evaluate(() => window.sessionStorage.clear());
    await page.reload();

    await expect(discountRateField(page)).toHaveValue(newValue);
    await expect(customStateLabel(page).first()).toBeVisible();
    expect((await getDurableAppliedAssumptions(page)).globalParameters.discountRate).toBe(Number(newValue) / 100);
  });

  test('a reset in one tab cannot be undone by another tab session @smoke', async ({ page, context }) => {
    await clearAppLocalStorage(page);
    await page.goto('/assumptions');

    const discountRateInput = discountRateField(page);
    const defaultValue = await discountRateInput.inputValue();
    const newValue = defaultValue === '3' ? '4' : '3';
    await saveCustomDiscountRate(page, newValue);

    const resetPage = await context.newPage();
    await resetPage.goto('/assumptions');
    await expect(discountRateField(resetPage)).toHaveValue(newValue);

    await discountRateField(resetPage).fill(defaultValue);
    await resetPage.getByRole('button', { name: 'Apply' }).click();
    await expect.poll(() => getDurableAppliedAssumptionsRaw(resetPage)).toBe('null');

    // The first tab still has the pre-reset compatibility mirror. Refreshing
    // it must honor the shared durable tombstone and clear that stale copy.
    await expect.poll(() => page.evaluate(() => window.sessionStorage.getItem('customEffectsData'))).not.toBeNull();
    await page.reload();

    await expect(discountRateField(page)).toHaveValue(defaultValue);
    await expect(customStateLabel(page)).toHaveCount(0);
    await expect.poll(() => getDurableAppliedAssumptionsRaw(page)).toBe('null');
    await expect.poll(() => page.evaluate(() => window.sessionStorage.getItem('customEffectsData'))).toBeNull();

    await resetPage.close();
  });

  test('assumptions reset flow clears custom global parameter @smoke', async ({ page }) => {
    await clearAppLocalStorage(page);
    await page.goto('/assumptions');

    const discountRateInput = discountRateField(page);
    const defaultValue = await discountRateInput.inputValue();
    const newValue = defaultValue === '3' ? '4' : '3';

    await saveCustomDiscountRate(page, newValue);
    await expect(customStateLabel(page).first()).toBeVisible();

    // Revert from the "Differences from default assumptions" section.
    await page.getByRole('button', { name: /differences? from default assumptions/i }).click();
    await page.getByRole('button', { name: 'Revert Discount Rate (%)' }).click();

    await expect(discountRateInput).toHaveValue(defaultValue);
    await expect.poll(() => getDurableAppliedAssumptionsRaw(page)).toBe('null');
    await expect(customStateLabel(page)).toHaveCount(0);
  });

  test('assumptions recipients flow supports override, disable, save, and reset @smoke', async ({ page }) => {
    await clearAppLocalStorage(page);
    await page.goto('/assumptions');

    await page.getByRole('tab', { name: 'Recipients' }).click();

    const recipientSearchInput = page.getByPlaceholder('Search recipients...');
    await recipientSearchInput.fill(RECIPIENT_SEARCH_TOKEN);

    // The first card's entity link names the recipient this test edits; card
    // actions carry per-entity accessible names ("Edit X" / "Reset X").
    const entityLink = page.getByRole('tabpanel').getByRole('link').first();
    await expect(entityLink).toBeVisible();
    const entityName = (await entityLink.innerText()).trim();

    await page.getByRole('button', { name: `Edit ${entityName}`, exact: true }).click();

    await expect(page.getByRole('heading', { name: /Edit effects for recipient/i })).toBeVisible();

    // Recipient edits are override-only in the current UI: fill the first
    // effect's cost field to create an override.
    const costInput = page.getByRole('textbox', { name: /Cost per life-year/i }).first();
    await expect(costInput).toBeVisible();
    await costInput.fill('123');

    await page.getByRole('button', { name: 'Disable effect' }).first().click();
    await expect(page.getByRole('button', { name: 'Enable effect' }).first()).toBeVisible();

    await page.getByRole('button', { name: 'Apply' }).click();
    await expect.poll(() => hasRecipientCustomizations(page)).toBe(true);
    await expect(customStateLabel(page).first()).toBeVisible();

    // The customized recipient's card grows a per-card reset action.
    await page.getByRole('button', { name: `Reset ${entityName}`, exact: true }).click();
    await expect.poll(() => getDurableAppliedAssumptionsRaw(page)).toBe('null');
    await expect(customStateLabel(page)).toHaveCount(0);
  });

  test('assumptions categories flow supports edit, save, and reset @smoke', async ({ page }) => {
    await clearAppLocalStorage(page);
    await page.goto('/assumptions');

    await page.getByRole('tab', { name: 'Causes' }).click();

    // Same per-entity naming as the recipients flow.
    const entityLink = page.getByRole('tabpanel').getByRole('link').first();
    await expect(entityLink).toBeVisible();
    const entityName = (await entityLink.innerText()).trim();

    await page.getByRole('button', { name: `Edit ${entityName}`, exact: true }).click();

    await expect(page.getByRole('heading', { name: /Edit effects for cause/i })).toBeVisible();

    const categoryEffectInputs = page.locator('input[id^="effect-0-"]');
    await expect(categoryEffectInputs.first()).toBeVisible();
    await categoryEffectInputs.first().fill('1234');
    await categoryEffectInputs.nth(1).fill('3');

    // The category editor shows Apply in both its header and footer.
    await page.getByRole('button', { name: 'Apply' }).last().click();
    await expect.poll(() => hasCategoryCustomizations(page)).toBe(true);
    await expect(customStateLabel(page).first()).toBeVisible();

    // The customized cause's card grows a per-card reset action.
    await page.getByRole('button', { name: `Reset ${entityName}`, exact: true }).click();
    await expect.poll(() => getDurableAppliedAssumptionsRaw(page)).toBe('null');
    await expect(customStateLabel(page)).toHaveCount(0);
  });

  test('assumptions editor guards unapplied drill-in edits on navigation @smoke', async ({ page }) => {
    await clearAppLocalStorage(page);
    await page.goto('/assumptions?tab=categories');

    const entityLink = page.getByRole('tabpanel').getByRole('link').first();
    await expect(entityLink).toBeVisible();
    const entityName = (await entityLink.innerText()).trim();
    await page.getByRole('button', { name: `Edit ${entityName}`, exact: true }).click();
    await expect(page.getByRole('heading', { name: /Edit effects for cause/i })).toBeVisible();

    await page.locator('input[id^="effect-0-"]').first().fill('1234');

    // Tabs stay enabled while editing; switching away from a dirty draft
    // prompts instead of locking.
    await page.getByRole('tab', { name: 'Recipients' }).click();
    const guardDialog = page.getByRole('dialog', { name: 'Apply your edits before leaving?' });
    await expect(guardDialog).toBeVisible();
    await guardDialog.getByRole('button', { name: 'Keep editing' }).click();
    await expect(guardDialog).not.toBeVisible();
    await expect(page.getByRole('heading', { name: /Edit effects for cause/i })).toBeVisible();

    // The real browser back button gets the same guard, and applying from the
    // prompt commits the draft and completes the navigation.
    await page.goBack();
    await expect(guardDialog).toBeVisible();
    await guardDialog.getByRole('button', { name: 'Apply and leave' }).click();
    await expect(page.getByRole('heading', { name: /Edit effects for cause/i })).not.toBeVisible();
    await expect.poll(() => hasCategoryCustomizations(page)).toBe(true);
  });

  test('specific donations modal supports add/edit/delete with persistence @smoke', async ({ page }) => {
    await clearAppLocalStorage(page);
    await page.goto('/calculator');

    const totalDonatedValue = page.getByTestId('calculator-total-donated-value');
    await expect(totalDonatedValue).toContainText('$0');

    const selectedRecipientName = await addSpecificDonation(page);

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

test.describe('Mobile calculator viewport stability', () => {
  // Keep this emulation browser-neutral so the test also runs in the optional
  // Firefox/WebKit release pass; the routine e2e command still uses Chromium.
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

  test('adding a specific donation preserves the page scroll position @smoke', async ({ page }) => {
    await clearAppLocalStorage(page);
    await page.goto('/calculator');

    const addButton = page.getByRole('button', { name: 'Add Specific Donation' });
    await addButton.scrollIntoViewIfNeeded();
    const scrollYBeforeOpen = await page.evaluate(() => window.scrollY);
    expect(scrollYBeforeOpen).toBeGreaterThan(0);

    await addSpecificDonation(page);
    await expect(page.getByRole('heading', { name: 'Your Specific Donations' })).toBeVisible();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(scrollYBeforeOpen);
  });
});
