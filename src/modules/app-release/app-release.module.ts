import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppReleaseService } from './app-release.service';
import { AppReleaseController } from './app-release.controller';
import { AppRelease, AppReleaseSchema } from './schemas/app-release.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AppRelease.name, schema: AppReleaseSchema }]),
  ],
  providers: [AppReleaseService],
  controllers: [AppReleaseController],
})
export class AppReleaseModule {}

