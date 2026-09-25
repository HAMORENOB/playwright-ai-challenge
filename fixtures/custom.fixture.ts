import {
  test as base,
  expect,
} from '@playwright/test';

import {
  CheckoutData,
  generateCheckoutData,
} from '../helpers/testData';

type CustomFixtures = {
  checkoutData: CheckoutData;
};

export const test =
  base.extend<CustomFixtures>({
    checkoutData: async ({}, use) => {
      const generatedData =
  await generateCheckoutData();

      console.log(
        'Datos generados para el checkout:',
        generatedData
      );

      await use(generatedData);
    },
  });

export { expect };