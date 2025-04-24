import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MediaService } from 'src/modules/media/services/media.service';
import { GetSignedURLDto } from '../dto/get-signed-url.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';

@Controller('mtym-api/media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('signed-url')
  @HttpCode(200)
  async getSignedURL(@Req() request: Request, @Body() body: GetSignedURLDto) {
    const userId = request['user'].id;
    const { filename, type, size, checksum } = body;
    const signedURL = await this.mediaService.getSignedURL(
      userId,
      filename,
      type,
      size,
      checksum,
    );

    if (!signedURL) {
      throw new BadRequestException();
    }

    return {
      url: signedURL,
      statusCode: 200,
    };
  }

  @Post('get-presigned-url')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @HttpCode(200)
  async getPresignedFileUrl(@Body() body: { key: string }) {
    try {
      const { key } = body;
      const presignedUrl = await this.mediaService.getPresignedFileUrl(key);
      
      return {
        url: presignedUrl,
        statusCode: 200,
      };
    } catch (error) {
      throw new BadRequestException('Could not generate presigned URL');
    }
  }
}
