import { expect, test } from '@playwright/test';

const CUSTOM_VALUES_INDICATOR = '[title="Using custom values"]';

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
});
