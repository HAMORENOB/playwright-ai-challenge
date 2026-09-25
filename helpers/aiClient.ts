export type OllamaResponse = {
  response: string;
};

export function getAIModel(): string {
  return process.env.AI_MODEL || 'llama3.2';
}

export function getOllamaBaseUrl(): string {
  return (
    process.env.OLLAMA_BASE_URL ||
    'http://localhost:11434'
  );
}

export async function askOllama(
  prompt: string
): Promise<string> {
  const response = await fetch(
    `${getOllamaBaseUrl()}/api/generate`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
  model: getAIModel(),
  prompt,
  stream: false,
  format: 'json',
  options: {
    temperature: 0,
  },
}),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Ollama respondió con estado ${response.status}`
    );
  }

  const data =
    (await response.json()) as OllamaResponse;

  if (!data.response) {
    throw new Error(
      'Ollama no devolvió contenido'
    );
  }

  return data.response;
}