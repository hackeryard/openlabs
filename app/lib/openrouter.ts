import OpenAI from "openai";

/**
 * OpenRouter Multi-Key Fallback & Rotation System
 * Supports:
 * - Single or comma-separated keys in CHATBOT_API_KEY or CHATBOT_API_KEYS
 * - OPENROUTER_API_KEY or OPENROUTER_API_KEYS
 * - Enumerated keys: CHATBOT_API_KEY_1, CHATBOT_API_KEY_2, etc.
 */

let activeKeyIndex = 0;

/**
 * Retrieves all configured OpenRouter API keys from environment variables.
 */
export function getOpenRouterApiKeys(): string[] {
  const keys: string[] = [];

  const rawEnvVars = [
    process.env.CHATBOT_API_KEYS,
    process.env.CHATBOT_API_KEY,
    process.env.OPENROUTER_API_KEYS,
    process.env.OPENROUTER_API_KEY,
  ];

  // Check enumerated keys (e.g. CHATBOT_API_KEY_1, CHATBOT_API_KEY_2, etc.)
  for (const [key, value] of Object.entries(process.env)) {
    if (
      /^(CHATBOT_API_KEY|OPENROUTER_API_KEY)(_\d+)?$/i.test(key) &&
      value &&
      !rawEnvVars.includes(value)
    ) {
      rawEnvVars.push(value);
    }
  }

  for (const raw of rawEnvVars) {
    if (!raw) continue;
    // Split by comma, semicolon, or newline
    const splitKeys = raw.split(/[,;\n\r]+/);
    for (const k of splitKeys) {
      const trimmed = k.trim();
      if (trimmed && !keys.includes(trimmed)) {
        keys.push(trimmed);
      }
    }
  }

  return keys;
}

/**
 * Executes a Chat Completion request through OpenRouter with automatic multi-key failover.
 */
export async function createChatCompletionWithFallback(
  params: OpenAI.Chat.ChatCompletionCreateParamsNonStreaming
): Promise<OpenAI.Chat.Completions.ChatCompletion> {
  const keys = getOpenRouterApiKeys();

  if (keys.length === 0) {
    throw new Error("Server misconfiguration: No OpenRouter API keys found in environment variables (CHATBOT_API_KEY)");
  }

  let lastError: any = null;
  const totalKeys = keys.length;

  // Try each key starting from the currently active index
  for (let attempt = 0; attempt < totalKeys; attempt++) {
    const currentIndex = (activeKeyIndex + attempt) % totalKeys;
    const currentKey = keys[currentIndex];
    const maskedKey = `${currentKey.substring(0, 8)}...${currentKey.substring(currentKey.length - 4)}`;

    try {
      const client = new OpenAI({
        apiKey: currentKey,
        baseURL: "https://openrouter.ai/api/v1",
      });

      const response = await client.chat.completions.create(params);

      // Successfully called with this key: save active index
      activeKeyIndex = currentIndex;
      return response;
    } catch (err: any) {
      lastError = err;
      const status = err?.status || err?.statusCode || 500;
      const message = err?.message || String(err);

      console.warn(
        `⚠️ [OpenRouter Fallback] Key [${currentIndex + 1}/${totalKeys}] (${maskedKey}) failed with status ${status}: ${message}. Attempting next available key...`
      );

      // Continue to next key
    }
  }

  // All keys exhausted
  console.error(`❌ [OpenRouter Fallback] All ${totalKeys} configured API key(s) failed or exhausted credits.`);
  throw lastError || new Error("All configured OpenRouter API keys failed.");
}

/**
 * Direct fetch request to OpenRouter with multi-key failover (e.g. for daily challenge generation).
 */
export async function fetchOpenRouterWithFallback(
  payload: any
): Promise<Response> {
  const keys = getOpenRouterApiKeys();

  if (keys.length === 0) {
    throw new Error("Server misconfiguration: No OpenRouter API keys configured in environment.");
  }

  let lastError: any = null;
  const totalKeys = keys.length;

  for (let attempt = 0; attempt < totalKeys; attempt++) {
    const currentIndex = (activeKeyIndex + attempt) % totalKeys;
    const currentKey = keys[currentIndex];
    const maskedKey = `${currentKey.substring(0, 8)}...${currentKey.substring(currentKey.length - 4)}`;

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentKey}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        activeKeyIndex = currentIndex;
        return response;
      }

      // If response is not ok (e.g. 401, 402, 429), parse error and try next
      const errorText = await response.text();
      console.warn(
        `⚠️ [OpenRouter Fetch Fallback] Key [${currentIndex + 1}/${totalKeys}] (${maskedKey}) returned ${response.status}: ${errorText}. Trying next key...`
      );
      lastError = new Error(`OpenRouter HTTP ${response.status}: ${errorText}`);
    } catch (fetchErr: any) {
      lastError = fetchErr;
      console.warn(
        `⚠️ [OpenRouter Fetch Fallback] Key [${currentIndex + 1}/${totalKeys}] (${maskedKey}) failed with network error: ${fetchErr?.message}. Trying next key...`
      );
    }
  }

  throw lastError || new Error("All configured OpenRouter API keys failed.");
}
