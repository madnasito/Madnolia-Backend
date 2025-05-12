import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Platform } from './schema/platform.schema';
import { Model } from 'mongoose';
import { CreatePlatformDto } from './dtos/create-platform.dto';
import { PlatformParent } from './enums/platform-parent.enum';

@Injectable()
export class PlatformsService {
  constructor(
    @InjectModel(Platform.name) private platformModel: Model<Platform>,
  ) {}

  create = (createPlatformDto: CreatePlatformDto) => {
    const createdPlatform = new this.platformModel(createPlatformDto);

    return createdPlatform.save();
  };

  getBySlug = (slug: string) => this.platformModel.findOne({ slug });

  getByParent = (parent: PlatformParent) => this.platformModel.find({ parent });
}
