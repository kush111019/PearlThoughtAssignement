import { v4 as uuid } from 'uuid';
import { Page, Section, PageTheme } from '@publication/shared';

export function createPage(
  title: string,
  brandId: string,
  sections: Section[] = [],
  theme?: PageTheme,
): Page {
  const slug = generateSlug(title);
  return {
    id: uuid(),
    title,
    slug,
    brandId,
    status: 'draft',
    sections,
    theme,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function createSection(
  type: Section['type'],
  title: string,
  content: Record<string, any> = {},
  order: number = 0,
): Section {
  return {
    id: uuid(),
    type,
    title,
    content,
    order,
  };
}
