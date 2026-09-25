# Playwright AI Challenge

Proyecto de automatización de pruebas end-to-end sobre SauceDemo, desarrollado con Playwright y TypeScript. Incluye autenticación reutilizable, custom fixtures, intercepción de red, observabilidad, reporte Allure e integración local con Ollama para generación sintética de datos y validaciones semánticas.

## Funcionalidades implementadas

- Flujo completo de compra en SauceDemo.
- Autenticación reutilizable mediante storageState.
- Custom Fixture para inyectar datos del checkout.
- Intercepción de red con respuesta HTTP simulada.
- Capturas, video y trace ante fallos.
- Reporte HTML de Playwright.
- Reporte Allure.
- Generación sintética de datos con Ollama local.
- Aserciones semánticas con Ollama local.
- Ejecución local sin consumo de una API de pago.

## Tecnologías

- Node.js
- TypeScript
- Playwright Test
- Ollama
- Modelo llama3.2
- Allure Playwright
- npm

## Requisitos previos

- Windows 10 22H2 o posterior.
- Node.js 20 o posterior.
- npm.
- Git.
- Visual Studio Code.
- Ollama instalado y ejecutándose.
- Modelo llama3.2 descargado.
- Java, solamente si la versión local del generador Allure lo requiere.

## Instalación

Clonar el repositorio:

    git clone https://github.com/HAMORENOB/playwright-ai-challenge
    cd playwright-ai-challenge

Instalar dependencias:

    npm install

Instalar los navegadores de Playwright:

    npx playwright install

Instalar Ollama en Windows y descargar el modelo:

    ollama pull llama3.2

Verificar el modelo:

    ollama list

Comprobar que la API local responde:

    Invoke-RestMethod http://localhost:11434/api/tags

## Variables de entorno

Crear el archivo .env a partir de .env.example.

Contenido esperado:

    BASE_URL=https://www.saucedemo.com
    AI_PROVIDER=ollama
    AI_API_KEY=
    AI_MODEL=llama3.2
    OLLAMA_BASE_URL=http://localhost:11434

El archivo .env no debe publicarse en el repositorio.

## Estructura principal

    playwright-ai-challenge/
    |-- fixtures/
    |   `-- custom.fixture.ts
    |-- helpers/
    |   |-- aiAssertion.ts
    |   |-- aiClient.ts
    |   `-- testData.ts
    |-- playwright/
    |   `-- .auth/
    |-- tests/
    |   |-- auth.setup.ts
    |   |-- checkout.spec.ts
    |   |-- login.spec.ts
    |   `-- network-interception.spec.ts
    |-- .env.example
    |-- .gitignore
    |-- package.json
    |-- playwright.config.ts
    |-- tsconfig.json
    `-- README.md

## Escenarios automatizados

### Autenticación

El archivo tests/auth.setup.ts inicia sesión y guarda el estado autenticado en playwright/.auth/user.json. Los proyectos dependientes cargan ese estado mediante storageState.

### Compra completa

El archivo tests/checkout.spec.ts ejecuta:

1. Apertura del inventario con sesión almacenada.
2. Selección de producto.
3. Adición al carrito.
4. Inicio del checkout.
5. Diligenciamiento de datos sintéticos.
6. Validación del resumen.
7. Finalización de la compra.
8. Validación semántica del mensaje final.

### Intercepción de red

El archivo tests/network-interception.spec.ts intercepta una solicitud de imagen, devuelve una respuesta HTTP 404 controlada y valida que la interfaz continúe disponible.

## Integración de inteligencia artificial

### Opción B: aserciones semánticas

La función expectAI(actualText, expectedIntent), ubicada en helpers/aiAssertion.ts, envía el texto observado y la intención esperada a Ollama. El modelo devuelve un JSON con:

    {
      "matches": true,
      "explanation": "Explicación breve"
    }

Playwright verifica que matches sea true.

### Opción C: generación sintética

La función generateCheckoutData(), ubicada en helpers/testData.ts, solicita a Ollama datos ficticios para el checkout:

    {
      "firstName": "Nombre ficticio",
      "lastName": "Apellido ficticio",
      "postalCode": "123456"
    }

La información es inyectada a la prueba mediante fixtures/custom.fixture.ts.

## Ejecución

Validar TypeScript:

    npx tsc -p tsconfig.json --noEmit

Listar pruebas:

    npx playwright test --list

Ejecutar todas las pruebas de Chromium:

    npx playwright test --project=chromium

Ejecutar el checkout mostrando el navegador:

    npx playwright test tests/checkout.spec.ts --project=chromium --headed

Ejecutar en modo UI:

    npx playwright test --ui

## Reporte HTML de Playwright

Después de ejecutar las pruebas:

    npx playwright show-report

## Reporte Allure

Eliminar resultados anteriores, si se requiere una corrida limpia:

    Remove-Item .\allure-results -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item .\allure-report -Recurse -Force -ErrorAction SilentlyContinue

Ejecutar las pruebas:

    npx playwright test --project=chromium

Generar el reporte:

    npx allure generate .\allure-results

Abrir el reporte:

    npx allure open .\allure-report

## Observabilidad

El archivo playwright.config.ts conserva las siguientes evidencias ante fallos:

    trace: retain-on-failure
    screenshot: only-on-failure
    video: retain-on-failure

Los resultados se almacenan en test-results y se exponen en los reportes configurados.

## Resultados obtenidos

La ejecución validada registró cuatro pruebas aprobadas en Allure:

- Autenticación.
- Compra completa.
- Intercepción de red.
- Inicio de sesión independiente.

## Seguridad

- No publicar .env.
- No publicar playwright/.auth.
- No utilizar datos reales de clientes, empleados o transacciones.
- Utilizar únicamente datos sintéticos.
- No deshabilitar la validación TLS.
- Validar las instalaciones y modelos locales conforme a las políticas corporativas.

## Autor

Harold Arley Moreno Bermudez

## Estado

Implementación funcional con Playwright, TypeScript, Ollama y Allure.
