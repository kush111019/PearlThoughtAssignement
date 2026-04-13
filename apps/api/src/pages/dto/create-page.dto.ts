export class CreatePageDto {
  title!: string;
  brandId!: string;
  templateId?: string;
  status!: 'draft' | 'published' | 'archived'
}
