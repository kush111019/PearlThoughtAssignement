import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Page, Section } from '@publication/shared';
import { createPage, createSection, generateSlug } from './page.entity';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { UpdateSectionDto } from './dto/update-section.dto';

@Injectable()
export class PagesService {
  private pages: Map<string, Page> = new Map();
  private slugIndex: Map<string, string> = new Map();
  private slugRedirects: Map<string, string> = new Map();

  async findAll(brandId?: string): Promise<Page[]> {
    const pages = Array.from(this.pages.values());
    if (brandId) {
      return pages.filter((p) => p.brandId === brandId);
    }
    return pages;
  }

  async findById(id: string): Promise<Page> {
    const page = this.pages.get(id);
    if (!page) {
      throw new NotFoundException(`Page ${id} not found`);
    }
    return page;
  }

  async findBySlug(slug: string): Promise<Page> {
    // Check for redirects first
    const redirectTarget = this.slugRedirects.get(slug);
    if (redirectTarget) {
      const pageId = this.slugIndex.get(redirectTarget);
      if (pageId) {
        return this.findById(pageId);
      }
    }

    const pageId = this.slugIndex.get(slug);
    if (!pageId) {
      throw new NotFoundException(`Page with slug "${slug}" not found`);
    }
    return this.findById(pageId);
  }

  async create(dto: CreatePageDto): Promise<Page> {
    // If creating from template, clone the template page
    if (dto.templateId) {
      return this.cloneFromTemplate(dto.templateId, dto);
    }

    const slug = generateSlug(dto.title);
    if (this.slugIndex.has(slug)) {
      throw new ConflictException(`Slug "${slug}" is already in use`);
    }

    const page = createPage(dto.title, dto.brandId);
    this.pages.set(page.id, page);
    this.slugIndex.set(page.slug, page.id);

    return page;
  }

  async update(id: string, dto: UpdatePageDto): Promise<Page> {
    const page = await this.findById(id);

    if (dto.title && dto.title !== page.title) {
      const newSlug = generateSlug(dto.title);

      const existingPageId = this.slugIndex.get(newSlug);
      if (existingPageId && existingPageId !== id) {
        throw new ConflictException(`Slug "${newSlug}" is already in use`);
      }

      // Store redirect from old slug to new slug
      if (page.slug !== newSlug) {
        this.slugRedirects.set(page.slug, newSlug);
        this.slugIndex.set(newSlug, id);
      }

      page.title = dto.title;
      page.slug = newSlug;
    }

    if (dto.status) {
      page.status = dto.status;
    }

    if (dto.theme) {
      page.theme = {
        primaryColor: dto.theme.primaryColor || page.theme?.primaryColor || '#000000',
        secondaryColor: dto.theme.secondaryColor || page.theme?.secondaryColor || '#ffffff',
        fontFamily: dto.theme.fontFamily || page.theme?.fontFamily || 'system-ui',
        headerStyle: dto.theme.headerStyle || page.theme?.headerStyle || 'centered',
      };
    }

    page.updatedAt = new Date().toISOString();
    return page;
  }

  async delete(id: string): Promise<void> {
    const page = await this.findById(id);
    this.slugIndex.delete(page.slug);
    this.pages.delete(id);
  }

  // Section management

  async addSection(pageId: string, type: Section['type'], title: string, content: Record<string, any> = {}): Promise<Section> {
    const page = await this.findById(pageId);
    const order = page.sections.length;
    const section = createSection(type, title, content, order);
    page.sections.push(section);
    page.updatedAt = new Date().toISOString();
    return section;
  }

  async updateSection(pageId: string, sectionId: string, dto: UpdateSectionDto): Promise<Section> {
    const page = await this.findById(pageId);
    const section = page.sections.find((s) => s.id === sectionId);
    if (!section) {
      throw new NotFoundException(`Section ${sectionId} not found`);
    }

    if (dto.title !== undefined) section.title = dto.title;
    if (dto.content !== undefined) Object.assign(section.content, dto.content);
    if (dto.order !== undefined) section.order = dto.order;

    page.updatedAt = new Date().toISOString();
    return section;
  }

  async removeSection(pageId: string, sectionId: string): Promise<void> {
    const page = await this.findById(pageId);
    const index = page.sections.findIndex((s) => s.id === sectionId);
    if (index === -1) {
      throw new NotFoundException(`Section ${sectionId} not found`);
    }
    page.sections.splice(index, 1);
    // Re-order remaining sections
    page.sections.forEach((s, i) => (s.order = i));
    page.updatedAt = new Date().toISOString();
  }

  // Template cloning

  private async cloneFromTemplate(templateId: string, dto: CreatePageDto): Promise<Page> {
    const template = await this.findById(templateId);

    const slug = generateSlug(dto.title);
    if (this.slugIndex.has(slug)) {
      throw new ConflictException(`Slug "${slug}" is already in use`);
    }

    const newPage: Page = {
      ...template,
      id: require('uuid').v4(),
      title: dto.title,
      slug,
      brandId: dto.brandId,
      status: 'draft',
      sections: template.sections,
      theme: template.theme ? { ...template.theme } : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.pages.set(newPage.id, newPage);
    this.slugIndex.set(newPage.slug, newPage.id);

    return newPage;
  }
}
