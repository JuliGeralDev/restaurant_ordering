const MAX_PAYLOAD_SIZE = 16 * 1024; // 16KB

export function validatePayloadSize(body: string | undefined) {
  if (!body) return;

  const size = Buffer.byteLength(body, 'utf8');

  if (size > MAX_PAYLOAD_SIZE) {
    throw new Error(`Payload exceeds ${MAX_PAYLOAD_SIZE / 1024}KB limit`);
  }
}