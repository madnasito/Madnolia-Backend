import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Param,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { AppReleaseService } from './app-release.service';
import { ReleasePlatform } from './enums/release-platform.enum';
import { AppRelease } from './schemas/app-release.schema';
import { CreateReleaseDto } from './dtos/create-release.dto';
import * as multerfileInterface from 'src/common/interfaces/multerfile.interface';
import { AdminUserGuard } from 'src/common/guards/admin-user.guard';
import { ReleaseResponse } from './interfaces/release-response.interface';

@Controller('app-release')
export class AppReleaseController {
    constructor(private readonly appReleaseService: AppReleaseService) { }

    @Get('')
    async getLatestPlatformsReleases(): Promise<ReleaseResponse> {
        return await this.appReleaseService.getLastPlatformsReleases();
    }

    @Get(':platform')
    async getCurrentPlatformRelease(@Param('platform') platform: ReleasePlatform): Promise<AppRelease> {
        return await this.appReleaseService.getCurrentPlatformRelease(platform);
    }

    @UseGuards(AdminUserGuard)
    @Post('new-release')
    @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
    async createRelease(
        @Body() release: CreateReleaseDto,
        @UploadedFile() file: multerfileInterface.MulterFile,
    ): Promise<AppRelease> {
        if (!file) throw new BadRequestException('Release file is required');
        return await this.appReleaseService.createRelease(release, file);
    }
}

