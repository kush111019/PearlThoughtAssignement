import { v4 as uuid } from 'uuid';
import { Brand } from '@publication/shared';

export function createBrand(
  name: string,
  contactEmail: string,
  primaryColor: string = '#1a1a2e',
  secondaryColor: string = '#e2e2e2',
): Brand {
  return {
    id: uuid(),
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    primaryColor,
    secondaryColor,
    contactEmail,
    settings: {},
  };
}
