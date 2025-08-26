import { Injectable } from '@nestjs/common';
import { MatchesService } from '../matches/matches.service';
import { PlatformsService } from '../platforms/platforms.service';
import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';

@Injectable()
export class SitemapService {
  constructor(
    private readonly matchesService: MatchesService,
    private readonly platformsService: PlatformsService,
  ) {}

  async generateSitemap() {
    const smStream = new SitemapStream({ hostname: 'https://madnolia.app' });

    const staticUrls = [
      { url: '/', changefreq: 'daily', priority: 1.0 },
      { url: '/platforms', changefreq: 'yearly', priority: 0.8 },
      { url: '/about', changefreq: 'yearly', priority: 0.5 },
      { url: '/download', changefreq: 'yearly', priority: 0.5 },
    ];

    const platforms = await this.platformsService.findAll();

    const platformUrls = platforms.map((platform) => ({
      url: `/platforms/${platform.slug}`,
      changefreq: 'yearly',
      priority: 0.7,
    }));

    const parentPlatforms = new Set<string>();
    platforms.forEach((platform) => {
      if (platform.parent) {
        parentPlatforms.add(platform.parent);
      }
    });

    const parentPlatformUrls = Array.from(parentPlatforms).map(
      (parentSlug) => ({
        url: `/platforms/${parentSlug}`,
        changefreq: 'yearly',
        priority: 0.8,
      }),
    );

    const matches = await this.matchesService.findAllActive();
    const matchUrls = matches.map((match) => ({
      url: `/match/${match._id}`,
      changefreq: 'daily',
      priority: 0.9,
    }));

    const allUrls = [
      ...staticUrls,
      ...parentPlatformUrls,
      ...platformUrls,
      ...matchUrls,
    ];

    return streamToPromise(Readable.from(allUrls).pipe(smStream)).then((data) =>
      data.toString(),
    );
  }
}
