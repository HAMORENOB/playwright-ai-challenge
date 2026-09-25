import {
test,
expect,
} from '../fixtures/custom.fixture';

import { expectAI } from '../helpers/aiAssertion';

test(
  'debe completar una compra correctamente',
  async ({ page, checkoutData }) => {

    await test.step(
  'Abrir el inventario con la sesión almacenada',
  async () => {
    await page.goto('/inventory.html');

    await expect(page).toHaveURL(/inventory/);

    await expect(
      page.locator('.inventory_list')
    ).toBeVisible();
  }
);

    await test.step('Seleccionar el primer producto', async () => {
      const firstProduct = page
        .locator('.inventory_item')
        .first();

      await expect(firstProduct).toBeVisible();

      const productName = await firstProduct
        .locator('.inventory_item_name')
        .textContent();

      console.log(`Producto seleccionado: ${productName}`);

      await firstProduct
        .getByRole('button', { name: 'Add to cart' })
        .click();

      await expect(
        page.locator('.shopping_cart_badge')
      ).toHaveText('1');
    });

    await test.step('Abrir el carrito', async () => {
      await page
        .locator('.shopping_cart_link')
        .click();

      await expect(page).toHaveURL(/cart/);

      await expect(
        page.locator('.cart_item')
      ).toHaveCount(1);
    });

    await test.step('Iniciar el checkout', async () => {
      await page
        .getByRole('button', { name: 'Checkout' })
        .click();

      await expect(page).toHaveURL(
        /checkout-step-one/
      );
    });

    await test.step('Completar los datos del comprador', async () => {
      await page
        .getByPlaceholder('First Name')
        .fill(checkoutData.firstName);

      await page
        .getByPlaceholder('Last Name')
        .fill(checkoutData.lastName);

      await page
        .getByPlaceholder('Zip/Postal Code')
        .fill(checkoutData.postalCode);

      await page
        .getByRole('button', { name: 'Continue' })
        .click();

      await expect(page).toHaveURL(
        /checkout-step-two/
      );
    });

    await test.step('Validar el resumen de compra', async () => {
      await expect(
        page.locator('.cart_item')
      ).toHaveCount(1);

      await expect(
        page.locator('.summary_total_label')
      ).toBeVisible();
    });

    await test.step('Finalizar la compra', async () => {
      await page
        .getByRole('button', { name: 'Finish' })
        .click();

      await expect(page).toHaveURL(
        /checkout-complete/
      );
    });

   await test.step(
  'Validar la confirmación con IA',
  async () => {
    const confirmationHeader = page.locator(
      '.complete-header'
    );

    const confirmationDescription = page.locator(
      '.complete-text'
    );

    await expect(page).toHaveURL(
      /checkout-complete/
    );

    await expect(
      confirmationHeader
    ).toBeVisible();

    await expect(
      confirmationDescription
    ).toBeVisible();

    await expect(
      confirmationHeader
    ).toContainText('Thank you');

    const descriptionText =
      await confirmationDescription.innerText();

    console.log(
      'Texto evaluado semánticamente:',
      descriptionText
    );

    await expectAI(
      descriptionText,
      'El pedido fue enviado o despachado y será entregado al cliente'
    );
  }
);
  });