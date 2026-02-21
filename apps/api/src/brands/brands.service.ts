import { Injectable, NotFoundException } from '@nestjs/common';
import { Brand } from '@publication/shared';
import { createBrand } from './brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';

@Injectable()
export class BrandsService {
  private brands: Map<string, Brand> = new Map();

  async findAll(): Promise<Brand[]> {
    return Array.from(this.brands.values());
  }

  async findById(id: string): Promise<Brand> {
    const brand = this.brands.get(id);
    if (!brand) {
      throw new NotFoundException(`Brand ${id} not found`);
    }
    return brand;
  }

  async create(dto: CreateBrandDto): Promise<Brand> {
    const brand = createBrand(
      dto.name,
      dto.contactEmail,
      dto.primaryColor,
      dto.secondaryColor,
    );
    if (dto.logoUrl) brand.logoUrl = dto.logoUrl;
    this.brands.set(brand.id, brand);
    return brand;
  }

  async update(id: string, updates: Partial<Brand>): Promise<Brand> {
    const brand = await this.findById(id);
    Object.assign(brand, updates, { id: brand.id });
    return brand;
  }

  async delete(id: string): Promise<void> {
    if (!this.brands.has(id)) {
      throw new NotFoundException(`Brand ${id} not found`);
    }
    this.brands.delete(id);
  }
}
