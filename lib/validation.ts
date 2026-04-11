/**
 * API Key validation utilities
 */

/**
 * Validate Groq API key format
 * Groq keys should start with 'gsk_'
 */
export function validateGroqApiKey(key: string): {
  valid: boolean;
  error?: string;
} {
  if (!key || typeof key !== 'string') {
    return {
      valid: false,
      error: 'API key is required',
    };
  }

  const trimmedKey = key.trim();

  if (trimmedKey.length < 20) {
    return {
      valid: false,
      error: 'API key is too short',
    };
  }

  if (!trimmedKey.startsWith('gsk_')) {
    return {
      valid: false,
      error: 'Groq API key should start with "gsk_"',
    };
  }

  return {
    valid: true,
  };
}
