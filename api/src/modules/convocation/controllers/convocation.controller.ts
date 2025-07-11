import {
  Controller,
  Get,
  HttpCode,
  Request,
  Response,
  HttpStatus,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { ConvocationService } from '../services/convocation.service';
import { Response as ExpressResponse } from 'express';
import { RolesGuard } from '../../../guards/roles.guard';
import { Roles } from '../../../decorators/roles.decorator';
import { USER_ROLE } from '../../../constants';

@Controller('mtym-api/convocation')
@UseGuards(RolesGuard)
export class ConvocationController {
  constructor(private readonly convocationService: ConvocationService) {}

  @Get('download')
  @HttpCode(HttpStatus.OK)
  @Roles(USER_ROLE)
  async downloadConvocation(
    @Request() req,
    @Response() res: ExpressResponse,
  ): Promise<void> {
    try {
      const userId = req['user'].id;
      const pdfBuffer = await this.convocationService.generateConvocation(
        userId,
      );

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="convocation_${userId}.pdf"`,
        'Content-Length': pdfBuffer.length,
      });

      res.end(pdfBuffer);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
