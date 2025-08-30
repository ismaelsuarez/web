import { normalizeAddress } from '../../src/payments/mp.helpers';

describe('normalizeAddress', () => {
  it('coerces numeric street_number to string', () => {
    const out = normalizeAddress({
      street_name: 'Av. Siempre Viva',
      street_number: 742,
      zip_code: '1000',
      city: 'CABA',
      state: 'Buenos Aires',
    });
    expect(out.street_number).toBe('742');
  });

  it('fallbacks to "0" when street_number missing', () => {
    const out = normalizeAddress({
      street_name: 'Av. Siempre Viva',
      zip_code: '1000',
      city: 'CABA',
      state: 'Buenos Aires',
    });
    expect(out.street_number).toBe('0');
  });
});


