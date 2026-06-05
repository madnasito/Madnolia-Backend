import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import AdmZip = require('adm-zip');
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

        // Build the target directory: public/releases/{platform}/{version}/
        const platformDir = path.join(process.cwd(), 'public', 'releases', release.platform, release.version);

        // Step 1: Validate that the uploaded file is a zip
        const ext = file.originalname.split('.').pop()?.toLowerCase().trim();
        if (ext !== 'zip') {
            throw new BadRequestException('Uploaded file must be a .zip archive');
        }

        // Step 2: Extract zip contents into platformDir
        let zip: AdmZip;
        try {
            zip = new AdmZip(file.buffer);
        } catch {
            throw new BadRequestException('Uploaded file is not a valid zip archive');
        }

        fs.mkdirSync(platformDir, { recursive: true });
        zip.extractAllTo(platformDir, /* overwrite */ true);

        // Step 3: Insert DB record — rollback extracted files on failure
        try {
            const newReleaseData: Partial<AppRelease> = {
                ...release,
                createdAt: new Date(new Date().toUTCString()),
            };
            return await this.appReleaseModel.create(newReleaseData);
        } catch (error) {
            // Rollback: remove the extracted directory
            if (fs.existsSync(platformDir)) {
                fs.rmSync(platformDir, { recursive: true, force: true });
            }
            throw new InternalServerErrorException(
                `Release creation failed, files rolled back: ${error.message}`,
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
        const baseUrl = this.configService.get<string>('URL') || '';

        // 3. Mapear a Items
        const items: Item[] = latestReleases.map(release => ({
            version: release.version,
            shortVersion: release.codeVersion,
            changes: release.changes,
            date: this.formatDate(release.createdAt),
            mandatory: release.mandatory,
            url: this.buildDownloadUrl(baseUrl, release.platform, release.version),
            platform: release.platform,
        }));

        return {
            appName,
            description,
            items,
        };
    }

    private buildDownloadUrl(baseUrl: string, platform: string, version: string): string {
        return `${baseUrl}/releases/${platform}/${version}`;
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
