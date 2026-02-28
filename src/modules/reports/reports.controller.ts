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
import { ReportsService } from './reports.service';
import { FileInterceptor } from '@nestjs/platform-express';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { CreateUserReportDto } from './dtos/create-user-report.dto';
import { CreateBugReportDto } from './dtos/create-bug-report.dto';

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly config: ConfigService,
  ) {}

  @UseGuards(UserGuard)
  @Post('create-user-report')
  @UseInterceptors(FileInterceptor('media'))
  async create(
    @Request() req: any,
    @Body() body: CreateUserReportDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000 * 2048 }), // 2MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
        ],
      }),
    )
    media: MulterFile, // Make it optional if needed
  ) {
    if (!media) {
      throw new BadRequestException('Media file is required');
    }

    const form = new FormData();
    const apiKey = this.config.get<string>('IMGBB_KEY');

    form.append(
      'file',
      new Blob([new Uint8Array(media.buffer)], { type: media.mimetype }),
      media.originalname,
    );
    form.append('apikey', apiKey || '');

    try {
      const resp = await axios.post(
        'https://beeimg.com/api/upload/file/json/',
        form,
      );

      if (
        resp.data.files.status === 'Success' ||
        resp.data.files.status === 'Duplicate'
      ) {
        const createReportBody: CreateUserReportDto = {
          ...body,
          media: resp.data.files.url,
        };

        return this.reportsService.createUserReport(
          createReportBody,
          req.user.id,
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Logger.error({
          message: 'Error during image upload',
          status: error.response?.status,
          data: error.response?.data,
          error: error.message,
        });
      } else {
        Logger.error(error);
      }
      throw error;
    }
  }

  @UseGuards(UserGuard)
  @Post('create-bug-report')
  @UseInterceptors(FileInterceptor('media'))
  async createBugReport(
    @Request() req: any,
    @Body() body: CreateBugReportDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000 * 2048 }), // 2MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
        ],
      }),
    )
    media: MulterFile, // Make it optional if needed
  ) {
    if (!media) {
      throw new BadRequestException('Media file is required');
    }

    const form = new FormData();
    const apiKey = this.config.get<string>('IMGBB_KEY');

    form.append(
      'file',
      new Blob([new Uint8Array(media.buffer)], { type: media.mimetype }),
      media.originalname,
    );
    form.append('apikey', apiKey || '');

    try {
      const resp = await axios.post(
        'https://beeimg.com/api/upload/file/json/',
        form,
      );

      Logger.log(resp.data);

      if (
        resp.data.files.status === 'Success' ||
        resp.data.files.status === 'Duplicate'
      ) {
        const createReportBody: CreateBugReportDto = {
          ...body,
          media: resp.data.files.url,
        };

        return this.reportsService.createBugReport(
          createReportBody,
          req.user.id,
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Logger.error({
          message: 'Error during image upload',
          status: error.response?.status,
          data: error.response?.data,
          error: error.message,
        });
      } else {
        Logger.error(error);
      }
      throw error;
    }
  }
}
