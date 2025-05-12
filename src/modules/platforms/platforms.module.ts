import { Module } from '@nestjs/common';
import { PlatformsService } from './platforms.service';
import { PlatformsController } from './platforms.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Platform, PlatformSchema } from './schema/platform.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Platform.name, schema: PlatformSchema },
    ]),
  ],
  providers: [PlatformsService],
  controllers: [PlatformsController],
  exports: [PlatformsService],
})
export class PlatformsModule {}
