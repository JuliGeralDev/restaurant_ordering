const EMAIL_KEYS = ['email', 'contactEmail', 'userEmail'];
const PHONE_KEYS = ['phone', 'phoneNumber', 'mobile', 'contactPhone'];

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function tryParseJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function maskEmail(value: string): string {
  const [user = '', domain = '***'] = value.split('@');
  if (!user) {
    return `***@${domain}`;
  }

  return `${user[0]}***@${domain}`;
}

function maskPhone(value: string): string {
  const digitsOnly = value.replace(/\D/g, '');
  const visibleSuffix = digitsOnly.slice(-4);

  if (!visibleSuffix) {
    return '***';
  }

  return `*******${visibleSuffix}`;
}

function shouldMask(key: string, candidates: string[]): boolean {
  return candidates.some((candidate) => key.toLowerCase().includes(candidate.toLowerCase()));
}

function maskRecursive(data: unknown): unknown {
  if (typeof data === 'string') {
    const parsed = tryParseJson(data);
    if (parsed !== data) {
      return maskRecursive(parsed);
    }
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => maskRecursive(item));
  }

  if (!isPlainObject(data)) {
    return data;
  }

  return Object.entries(data).reduce<Record<string, unknown>>((masked, [key, value]) => {
    if (typeof value === 'string' && shouldMask(key, EMAIL_KEYS)) {
      masked[key] = maskEmail(value);
      return masked;
    }

    if (typeof value === 'string' && shouldMask(key, PHONE_KEYS)) {
      masked[key] = maskPhone(value);
      return masked;
    }

    masked[key] = maskRecursive(value);
    return masked;
  }, {});
}

export function maskPII<T>(data: T): T {
  return maskRecursive(data) as T;
}
