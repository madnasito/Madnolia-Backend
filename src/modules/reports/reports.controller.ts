import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  BadRequestException,
  FileTypeValidator,
  Logger,
} from '@nestjs/common';
import { UserGuard } from 'src/common/guards/user.guard';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { FileInterceptor } from '@nestjs/platform-express';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly config: ConfigService,
  ) {}

  @UseGuards(UserGuard)
  @Post('create')
  @UseInterceptors(FileInterceptor('media'))
  async create(
    @Request() req: any,
    @Body() body: CreateReportDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000 * 1024 }), // 1MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
        ],
      }),
    )
    media: Express.Multer.File, // Make it optional if needed
  ) {
    if (!media) {
      throw new BadRequestException('Media file is required');
    }

    const form = new FormData();
    const apiKey = this.config.get<string>('IMGBB_KEY');

    form.append('file', new Blob([media.buffer], { type: media.mimetype }));
    form.append('apikey', apiKey);

    try {
      const resp = await axios.post(
        'https://beeimg.com/api/upload/file/json/',
        form,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // Corrected Content-Type
          },
        },
      );

      if (
        resp.data.files.status === 'Success' ||
        resp.data.files.status === 'Duplicate'
      ) {
        const createReportBody: CreateReportDto = {
          media: resp.data.files.url,
          ...body,
        };

        return this.reportsService.create(createReportBody, req.user.id);
      }
    } catch (error) {
      Logger.error(error);
      throw new error();
    }
  }
}
