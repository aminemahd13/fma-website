import { Module } from '@nestjs/common';
import { ConvocationService } from './services/convocation.service';
import { ConvocationController } from './controllers/convocation.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [ConvocationController],
  providers: [ConvocationService],
  exports: [ConvocationService],
})
export class ConvocationModule {}
