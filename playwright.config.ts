import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Carga las variables guardadas en el archivo .env
dotenv.config({
  path: path.resolve(__dirname, '.env'),
});

export default defineConfig({
  // Carpeta donde se encuentran las pruebas
  testDir: './tests',

  // Permite ejecutar archivos de prueba en paralelo
  fullyParallel: true,

  // Evita publicar accidentalmente un test.only en integración continua
  forbidOnly: !!process.env.CI,

  // En CI se reintenta dos veces; localmente no se reintenta
  retries: process.env.CI ? 2 : 0,

  // En CI utiliza un trabajador; localmente usa el valor predeterminado
  workers: process.env.CI ? 1 : undefined,

  // Genera reporte en terminal y reporte HTML
  reporter: [
['list'],
[
'html',
{
open: 'never',
outputFolder: 'playwright-report',
},
],
['allure-playwright',
{resultsDir: 'allure-results',
},
],
],

  // Configuración compartida entre los navegadores
  use: {
    baseURL:
      process.env.BASE_URL || 'https://www.saucedemo.com',

    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  // Navegadores donde se podrán ejecutar las pruebas
  projects: [
{
  name: 'setup',
  testMatch: /.*\.setup\.ts/,
},
{
  name: 'chromium',
  use: {
  ...devices['Desktop Chrome'],
  storageState: 'playwright/.auth/user.json',
},
  dependencies: ['setup'],
  },
],
});