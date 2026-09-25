import {
  askOllama,
} from './aiClient';

export type CheckoutData = {
  firstName: string;
  lastName: string;
  postalCode: string;
};

export async function generateCheckoutData():
  Promise<CheckoutData> {
  const prompt = `
Genera datos sintéticos ficticios para una prueba de software.

No uses información de personas reales.

Devuelve exclusivamente un objeto JSON válido con esta estructura:

{
  "firstName": "nombre ficticio",
  "lastName": "apellido ficticio",
  "postalCode": "código postal de seis dígitos"
}

No agregues explicaciones ni bloques Markdown.
`;

  const output = await askOllama(prompt);

  const cleanOutput = output
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim();

  const data = JSON.parse(
    cleanOutput
  ) as CheckoutData;

  if (
    !data.firstName ||
    !data.lastName ||
    !data.postalCode
  ) {
    throw new Error(
      'Ollama no generó todos los datos requeridos'
    );
  }

  console.log(
    'Fuente de datos: Ollama local'
  );

  console.log(
    'Datos sintéticos generados:',
    data
  );

  return {
    firstName: String(data.firstName),
    lastName: String(data.lastName),
    postalCode: String(data.postalCode),
  };
}