export const sanitizeLogs = (rawText) => {
  if (!rawText) return "";
  // Redact API keys, passwords, secret tokens, or Bearer auth header patterns
  return rawText.replace(
    /(api_key|password|secret|bearer)\s*=\s*['"][^'"]+['"]/gi,
    '$1="[REDACTED_BY_LOGSENTINEL]"'
  );
};