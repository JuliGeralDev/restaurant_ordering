import { TimelineEventSource } from '@/domain/entities/timeline-event.entity';

const WEB_SOURCE_HEADER = 'x-client-source';

const getHeaderValue = (
  headers: Record<string, string | undefined> | undefined,
  headerName: string
) => {
  if (!headers) {
    return undefined;
  }

  const normalizedHeaderName = headerName.toLowerCase();

  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() === normalizedHeaderName) {
      return value;
    }
  }

  return undefined;
};

export const getRequestSource = (
  headers: Record<string, string | undefined> | undefined
): TimelineEventSource => {
  const explicitSource = getHeaderValue(headers, WEB_SOURCE_HEADER)?.toLowerCase();

  if (explicitSource === 'web') {
    return 'web';
  }

  return 'api';
};
