import { test, expect } from '@playwright/test';

test('simular error 404 en una imagen', async ({ page }) => {
  let imagenInterceptada = false;
  let urlInterceptada = '';

  await page.route('**/*', async (route) => {
    const request = route.request();

    if (
      request.resourceType() === 'image' &&
      imagenInterceptada === false
    ) {
      imagenInterceptada = true;
      urlInterceptada = request.url();
      console.log('Imagen interceptada:', urlInterceptada);

      await route.fulfill({
        status: 404,
        contentType: 'text/plain',
        body: 'Imagen no disponible',
      });

      return;
    }

    await route.continue();
  });

  await page.goto('/inventory.html');

  await expect(page).toHaveURL(/inventory/);

  await expect(
    page.locator('.inventory_list')
  ).toBeVisible();

  expect(imagenInterceptada).toBe(true);

  expect(urlInterceptada).not.toBe('');

  await expect(
    page.locator('.inventory_item')
  ).toHaveCount(6);

  await expect(
    page.locator('.shopping_cart_link')
  ).toBeVisible();
});