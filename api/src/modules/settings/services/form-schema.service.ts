import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FormSchema } from '../entities/form-schema.entity';

@Injectable()
export class FormSchemaService {
  constructor(
    @InjectRepository(FormSchema)
    private readonly formSchemaRepository: Repository<FormSchema>,
  ) {}

  async findAll(): Promise<FormSchema[]> {
    return this.formSchemaRepository.find();
  }

  async findOne(id: number): Promise<FormSchema> {
    return this.formSchemaRepository.findOne({ where: { id } });
  }

  async findActive(): Promise<FormSchema> {
    return this.formSchemaRepository.findOne({ where: { isActive: true } });
  }

  async create(formSchemaData: Partial<FormSchema>): Promise<FormSchema> {
    const formSchema = this.formSchemaRepository.create(formSchemaData);
    return this.formSchemaRepository.save(formSchema);
  }

  async update(id: number, formSchemaData: Partial<FormSchema>): Promise<FormSchema> {
    await this.formSchemaRepository.update(id, formSchemaData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.formSchemaRepository.delete(id);
  }

  async setActive(id: number): Promise<FormSchema> {
    // First, set all form schemas to inactive
    await this.formSchemaRepository.update({}, { isActive: false });
    
    // Then set the specified one to active
    await this.formSchemaRepository.update(id, { isActive: true });
    
    return this.findOne(id);
  }
}