export interface NormalizedAddressInput {
  street_name: string;
  street_number?: string | number | null | undefined;
  zip_code: string;
  city: string;
  state: string;
  country?: string;
}

export interface NormalizedAddressOutput {
  street_name: string;
  street_number: number;
  zip_code: string;
  city: string;
  state: string;
  country: string;
}

export function normalizeAddress(input: NormalizedAddressInput): NormalizedAddressOutput {
  const num = Number(input.street_number);
  const street_number = Number.isFinite(num) ? num : 0;
  return {
    street_name: input.street_name,
    street_number,
    zip_code: input.zip_code,
    city: input.city,
    state: input.state,
    country: input.country ?? 'AR',
  };
}


