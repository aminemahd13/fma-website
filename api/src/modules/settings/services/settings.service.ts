import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from '../entities/setting.entity';

@Injectable()
export class SettingsService {
  private readonly APPLICATIONS_OPEN_KEY = 'APPLICATIONS_OPEN';

  constructor(
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
  ) {
    // Initialize default settings if they don't exist
    this.initDefaultSettings();
  }

  private async initDefaultSettings() {
    const applicationsSetting = await this.findSettingByKey(this.APPLICATIONS_OPEN_KEY);
    
    if (!applicationsSetting) {
      // Default to applications being closed
      await this.createSetting(this.APPLICATIONS_OPEN_KEY, 'false');
    }
  }

  async getAllSettings() {
    const settings = await this.settingRepository.find();
    return settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});
  }

  async findSettingByKey(key: string) {
    return this.settingRepository.findOne({ where: { key } });
  }

  async createSetting(key: string, value: string) {
    const setting = this.settingRepository.create({
      key,
      value,
    });
    return this.settingRepository.save(setting);
  }

  async updateSetting(key: string, value: string) {
    const setting = await this.findSettingByKey(key);
    
    if (setting) {
      setting.value = value;
      return this.settingRepository.save(setting);
    } else {
      return this.createSetting(key, value);
    }
  }

  async isApplicationsOpen() {
    const setting = await this.findSettingByKey(this.APPLICATIONS_OPEN_KEY);
    return setting ? setting.value === 'true' : false;
  }

  async setApplicationsOpen(isOpen: boolean) {
    return this.updateSetting(this.APPLICATIONS_OPEN_KEY, isOpen ? 'true' : 'false');
  }
} 