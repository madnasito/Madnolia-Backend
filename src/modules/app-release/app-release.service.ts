import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import { AppRelease } from './schemas/app-release.schema';
import { CreateReleaseDto } from './dtos/create-release.dto';
import { ReleasePlatform } from './enums/release-platform.enum';
import { MulterFile } from 'src/common/interfaces/multerfile.interface';

@Injectable()
export class AppReleaseService {
    constructor(@InjectModel(AppRelease.name) private readonly appReleaseModel: Model<AppRelease>) { }

    async createRelease(release: CreateReleaseDto, file: MulterFile): Promise<AppRelease> {
        // Build the target directory: <project-root>/releases/{platform}/
        const releasesRoot = path.join(process.cwd(), 'releases');
        const platformDir = path.join(releasesRoot, release.platform);
        const ext = path.extname(file.originalname);
        const fileName = `madnolia-${release.version}${ext}`;
        const filePath = path.join(platformDir, fileName);

        // Step 1: Ensure the directory exists (idempotent)
        fs.mkdirSync(platformDir, { recursive: true });

        // Step 2: Write file to disk
        fs.writeFileSync(filePath, file.buffer);

        // Step 3: Insert DB record — rollback file on failure
        try {
            const newReleaseData: Partial<AppRelease> = {
                ...release,
                createdAt: new Date(new Date().toUTCString()),
            };
            return await this.appReleaseModel.create(newReleaseData);
        } catch (error) {
            // Rollback: remove the written file
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            throw new InternalServerErrorException(
                `Release creation failed, file rolled back: ${error.message}`,
            );
        }
    }

    async getCurrentPlatformRelease(platform: ReleasePlatform): Promise<AppRelease> {
        const release = await this.appReleaseModel.findOne({ platform }).sort({ codeVersion: -1 });
        if (!release) throw new NotFoundException('NO_RELEASE_FOUND');
        return release;
    }
}
