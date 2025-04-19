import { Module } from '@nestjs/common';
import { ExcelController } from './controllers/excel.controller';
import { ExcelService } from './services/excel.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [ExcelController],
  providers: [ExcelService],
  exports: [],
})
export class ExcelModule {}
