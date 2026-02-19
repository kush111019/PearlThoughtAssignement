import { PageTheme } from '@publication/shared';

export class UpdatePageDto {
  title?: string;
  status?: 'draft' | 'published' | 'archived';
  theme?: Partial<PageTheme>;
}
