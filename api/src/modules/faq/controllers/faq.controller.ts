import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { FaqService } from '../services/faq.service';
import { CreateFaqDto } from '../dto/create-faq.dto';
import { UpdateFaqDto } from '../dto/update-faq.dto';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { ADMIN_ROLE } from 'src/constants';
import { Faq } from '../entities/faq.entity';

@Controller('mtym-api/faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(ADMIN_ROLE)
  create(@Body() createFaqDto: CreateFaqDto): Promise<Faq> {
    return this.faqService.create(createFaqDto);
  }

  @Get()
  findAllActive(): Promise<Faq[]> {
    return this.faqService.findAllActive();
  }

  @Get('all')
  @UseGuards(RolesGuard)
  @Roles(ADMIN_ROLE)
  findAll(): Promise<Faq[]> {
    return this.faqService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Faq> {
    return this.faqService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(ADMIN_ROLE)
  update(@Param('id') id: string, @Body() updateFaqDto: UpdateFaqDto): Promise<Faq> {
    return this.faqService.update(+id, updateFaqDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(ADMIN_ROLE)
  remove(@Param('id') id: string): Promise<void> {
    return this.faqService.remove(+id);
  }
} 