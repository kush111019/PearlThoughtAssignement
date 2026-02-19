import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { Section } from '@publication/shared';

@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Get()
  findAll(@Query('brandId') brandId?: string) {
    return this.pagesService.findAll(brandId);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.pagesService.findById(id);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.pagesService.findBySlug(slug);
  }

  @Post()
  create(@Body() dto: CreatePageDto) {
    return this.pagesService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePageDto) {
    return this.pagesService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.pagesService.delete(id);
  }

  // Section endpoints

  @Post(':id/sections')
  addSection(
    @Param('id') id: string,
    @Body() body: { type: Section['type']; title: string; content?: Record<string, any> },
  ) {
    return this.pagesService.addSection(id, body.type, body.title, body.content);
  }

  @Put(':id/sections/:sectionId')
  updateSection(
    @Param('id') id: string,
    @Param('sectionId') sectionId: string,
    @Body() dto: UpdateSectionDto,
  ) {
    return this.pagesService.updateSection(id, sectionId, dto);
  }

  @Delete(':id/sections/:sectionId')
  removeSection(@Param('id') id: string, @Param('sectionId') sectionId: string) {
    return this.pagesService.removeSection(id, sectionId);
  }
}
