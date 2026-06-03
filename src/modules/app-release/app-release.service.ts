import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import { AppRelease } from './schemas/app-release.schema';
import { CreateReleaseDto } from './dtos/create-release.dto';
import { ReleasePlatform } from './enums/release-platform.enum';
import { MulterFile } from 'src/common/interfaces/multerfile.interface';
import { ReleaseResponse } from './interfaces/release-response.interface';
import { ConfigService } from '@nestjs/config';
import { Item } from './interfaces/item.interface';

@Injectable()
export class AppReleaseService {
    constructor(
        @InjectModel(AppRelease.name) private readonly appReleaseModel: Model<AppRelease>,
        private readonly configService: ConfigService
    ) { }

    async createRelease(release: CreateReleaseDto, file: MulterFile): Promise<AppRelease> {

        const currentRelease = await this.appReleaseModel.findOne({ platform: release.platform, codeVersion: release.codeVersion }).exec();
        if (currentRelease) throw new BadRequestException('Release already exists for this platform and code version');

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

    async getLastPlatformsReleases(): Promise<ReleaseResponse> {
        // 1. Obtener la última release por plataforma (máximo codeVersion)
        const latestReleases = await this.appReleaseModel.aggregate([
            { $sort: { codeVersion: -1 } },
            {
                $group: {
                    _id: "$platform",
                    doc: { $first: "$$ROOT" }
                }
            },
            { $replaceRoot: { newRoot: "$doc" } }
        ]);

        const appName = 'Madnolia';
        const description = 'The ultimate game hub';
        const baseUrl = this.configService.get<string>('URL');

        // 3. Mapear a Items
        const items: Item[] = latestReleases.map(release => ({
            version: release.version,
            shortVersion: release.codeVersion,
            changes: release.changes,
            date: this.formatDate(release.createdAt),
            mandatory: release.mandatory,
            url: "url", //this.buildDownloadUrl(baseUrl, release.platform, release.version, release.codeVersion),
            platform: release.platform,
        }));

        return {
            appName,
            description,
            items,
        };
    }

    private formatDate(date: Date): string {
        return date.toISOString().split('T')[0]; // YYYY-MM-DD
    }

    async getCurrentPlatformRelease(platform: ReleasePlatform): Promise<AppRelease> {
        const release = await this.appReleaseModel.findOne({ platform }).sort({ codeVersion: -1 });
        if (!release) throw new NotFoundException('NO_RELEASE_FOUND');
        return release;
    }
}
