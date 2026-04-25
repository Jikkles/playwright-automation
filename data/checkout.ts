export const customer = {
  firstName: 'John',
  lastName: 'Smith',
  postalCode: 'SW1A 1AA',
};

export interface CustomerProfile {
  label: string;
  firstName: string;
  lastName: string;
  postalCode: string;
}

export const customers: CustomerProfile[] = [
  { label: 'standard UK address', firstName: 'John', lastName: 'Smith', postalCode: 'SW1A 1AA' },
  { label: 'US ZIP code', firstName: 'Jane', lastName: 'Doe', postalCode: '90210' },
  { label: 'hyphenated surname', firstName: 'Marie', lastName: 'Jones-Williams', postalCode: 'EC1A 1BB' },
  { label: 'long name', firstName: 'Christopher', lastName: 'Bartholomew-Henderson', postalCode: '10001' },
  { label: 'numeric-only postal code', firstName: 'Alex', lastName: 'Taylor', postalCode: '75008' },
];
