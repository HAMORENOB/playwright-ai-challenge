import { expect } from '@playwright/test';
import { askOllama } from './aiClient';

type SemanticValidation = {
  matches: boolean;
  explanation: string;
};

export async function expectAI(
  actualText: string,
  expectedIntent: string
): Promise<void> {
  const prompt = `
Actúa como validador semántico de textos para pruebas de software.

Compara el significado del texto observado con la intención esperada.

Texto observado:
"${actualText}"

Intención esperada:
"${expectedIntent}"

Reglas:

1. No exijas una coincidencia literal.
2. Evalúa si ambos textos comunican esencialmente la misma idea.
3. "Dispatched" significa enviado o despachado.
4. "Will arrive" significa que llegará o será entregado.
5. Responde true si el texto observado conserva esa intención.
6. Responde false si contradice la intención o habla de un tema diferente.

Devuelve exclusivamente este JSON:

{
  "matches": true,
  "explanation": "explicación breve"
}
`;

  const output = await askOllama(prompt);

  const cleanOutput = output
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim();

  const validation = JSON.parse(
    cleanOutput
  ) as SemanticValidation;

  if (typeof validation.matches !== 'boolean') {
    throw new Error(
      'Ollama no devolvió el campo matches correctamente'
    );
  }

  if (!validation.explanation) {
    throw new Error(
      'Ollama no devolvió una explicación'
    );
  }

    console.log(
    'Validación semántica con Ollama:',
    validation
  );

  expect(
    validation.matches,
    `La validación semántica falló: ${validation.explanation}`
  ).toBe(true);
}
