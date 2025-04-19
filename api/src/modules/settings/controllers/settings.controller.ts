import {
  Body,
  Controller,
  Get,
  HttpCode,
  Put,
  UseGuards,
} from '@nestjs/common';
import { SettingsService } from '../services/settings.service';
import { RolesGuard } from 'src/guards/roles.guard';
import { ADMIN_ROLE } from 'src/constants';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('mtym-api/settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @HttpCode(200)
  async getAllSettings() {
    const settings = await this.settingsService.getAllSettings();
    return {
      settings,
      statusCode: 200,
    };
  }

  @Get('applications-open')
  @HttpCode(200)
  async getApplicationsOpenStatus() {
    const isOpen = await this.settingsService.isApplicationsOpen();
    return {
      isOpen,
      statusCode: 200,
    };
  }

  @Put('applications-open')
  @HttpCode(200)
  @UseGuards(RolesGuard)
  @Roles(ADMIN_ROLE)
  async updateApplicationsOpenStatus(@Body() body: { isOpen: boolean }) {
    await this.settingsService.setApplicationsOpen(body.isOpen);
    return {
      isOpen: body.isOpen,
      statusCode: 200,
    };
  }
} 