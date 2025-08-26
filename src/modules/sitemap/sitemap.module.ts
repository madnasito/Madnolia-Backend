import { Module } from '@nestjs/common';
import { SitemapController } from './sitemap.controller';
import { SitemapService } from './sitemap.service';
import { MatchesModule } from '../matches/matches.module';
import { PlatformsModule } from '../platforms/platforms.module';

@Module({
  imports: [MatchesModule, PlatformsModule],
  controllers: [SitemapController],
  providers: [SitemapService],
})
export class SitemapModule {}
