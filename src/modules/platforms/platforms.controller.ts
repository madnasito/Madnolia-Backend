import { Controller, Get, Query } from '@nestjs/common';
// import { CreatePlatformDto } from './dtos/create-platform.dto';
import { PlatformsService } from './platforms.service';
import { PlatformParent } from './enums/platform-parent.enum';

@Controller('platforms')
export class PlatformsController {
  constructor(private readonly platformsService: PlatformsService) {}

  // @Post('create')
  // createPlatform(@Body() body: CreatePlatformDto) {
  //   return this.platformsService.create(body);
  // }

  @Get('get-by')
  getPlatformByParent(@Query('parent') parent: PlatformParent) {
    return this.platformsService.getByParent(parent);
  }
}
