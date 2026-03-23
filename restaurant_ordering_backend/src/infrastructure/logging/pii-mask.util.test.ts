import { maskPII } from '@/infrastructure/logging/pii-mask.util';

describe('maskPII', () => {
  it('masks nested email and phone fields inside objects', () => {
    const masked = maskPII({
      user: {
        email: 'jane.doe@example.com',
        profile: {
          phone: '+57 300 111 2233',
        },
      },
    });

    expect(masked).toEqual({
      user: {
        email: 'j***@example.com',
        profile: {
          phone: '*******2233',
        },
      },
    });
  });

  it('masks JSON string payloads before logging', () => {
    const masked = maskPII(
      JSON.stringify({
        email: 'john@example.com',
        phone: '3001112233',
      })
    );

    expect(masked).toEqual({
      email: 'j***@example.com',
      phone: '*******2233',
    });
  });

  it('masks pii inside arrays', () => {
    const masked = maskPII([
      { contactEmail: 'support@example.com' },
      { phoneNumber: '1234567890' },
    ]);

    expect(masked).toEqual([
      { contactEmail: 's***@example.com' },
      { phoneNumber: '*******7890' },
    ]);
  });
});
