import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Match } from './schemas/match.schema';
import { Model, Types } from 'mongoose';
import { GamesService } from 'src/modules/games/games.service';
import { GameInterface } from './interfaces/game.interface';
import { CreateMatchDto } from './dtos/create-match.dto';
import { NewMatchDto } from './dtos/new-match.dto';
import { MatchStatus } from './enums/status.enum';
import { UpdateMatchDto } from './dtos/update-match.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateNotificationDto } from '../notifications/dtos/create-notification.dto';
import { NotificationType } from '../notifications/enums/notification-type.enum';
import { PlatformParent } from '../platforms/enums/platform-parent.enum';
import { PlatformsService } from '../platforms/platforms.service';
import {
  MatchesTypeFilter,
  PlayerMatchesFiltersDto,
} from './dtos/player-matches-filters.dto';
import { UsersService } from '../users/users.service';
import { MatchesByPlatforms } from './interfaces/matches-by-platforms';
import { Platform } from 'src/common/enums/platforms.enum';
import { MatchWithGame } from './interfaces/match-with-game';
import { Users } from '../users/classes/user';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class MatchesService {
  constructor(
    @InjectModel(Match.name) private matchModel: Model<Match>,
    private readonly gamesService: GamesService,
    private readonly notificationsService: NotificationsService,
    private readonly notificationsGateway: NotificationsGateway,
    private readonly platformsService: PlatformsService,
    private readonly usersService: UsersService,
    private readonly users: Users,
  ) {}

  create = async (createMatchDto: CreateMatchDto, user: string) => {
    const gameData: GameInterface = await this.gamesService.getGame(
      createMatchDto.game,
    );

    const newMatch: NewMatchDto = {
      date: createMatchDto.date,
      game: gameData._id,
      inviteds: createMatchDto.inviteds,
      platform: createMatchDto.platform,
      title: createMatchDto.title != '' ? createMatchDto.title : 'Casual',
      tournament: null,
      description: createMatchDto.description,
      user: user,
      group: createMatchDto.group,
      duration: createMatchDto.duration,
      createdAt: new Date(new Date().toUTCString()),
    };

    const createdMatch = new this.matchModel(newMatch);

    const matchDb = await createdMatch.save();

    // await this.gamesService.increaseAmountInPlatform(gameData.gameId, createMatchDto.platform)

    matchDb.inviteds.forEach(async (element) => {
      const userSocketIds = this.users.getUserSocketsById(element);

      const newNotification: CreateNotificationDto = {
        path: matchDb.id,
        title: matchDb.title,
        thumb: gameData.background,
        type: NotificationType.MATCH_INVITATION,
        user: element,
        sender: matchDb.user.toString(),
      };

      const notificationDb =
        await this.notificationsService.create(newNotification);

      Logger.debug(userSocketIds);
      if (userSocketIds.length > 0)
        this.notificationsGateway.emitStandartNotification(
          userSocketIds,
          notificationDb,
        );
    });

    return matchDb;
  };

  getMatch = async (id: Types.ObjectId) => {
    if (!Types.ObjectId.isValid(id))
      throw new NotFoundException('NO_MATCH_FOUND');
    return this.matchModel.findById(id);
  };

  getMatchWithGame = async (id: string): Promise<MatchWithGame> => {
    if (!Types.ObjectId.isValid(id))
      throw new ConflictException('NO_GAME_FOUND');
    return this.matchModel.findOne(
      { _id: id },
      {},
      { populate: { path: 'game' } },
    );
  };

  getFullMatch = async (id: string) => {
    if (!Types.ObjectId.isValid(id))
      throw new NotFoundException('NO_MATCH_FOUND');

    const match = await this.matchModel.findOne(
      { _id: id },
      {},
      {
        populate: [
          { path: 'game' },
          { path: 'joined', select: '_id name thumb username' },
          { path: 'user', select: '_id name thumb username' },
        ],
      },
    );

    if (!match) throw new NotFoundException();

    return { match };
  };

  update = async (id: string, user: string, attrs: Partial<UpdateMatchDto>) => {
    const match = await this.matchModel.findOneAndUpdate(
      {
        _id: id,
        user,
        status: { $nin: [MatchStatus.FINISHED, MatchStatus.CANCELLED] },
      },
      attrs,
      { new: true }, // Return the updated document
    );

    if (!match) {
      throw new NotFoundException('NO_MATCH_FOUND');
    }

    return match;
  };

  delete = async (id: string, user: string) => {
    if (!Types.ObjectId.isValid(id))
      throw new NotFoundException('NO_MATCH_FOUND');

    const matchDeleted = await this.matchModel.findOneAndUpdate(
      { _id: id, user },
      { status: MatchStatus.CANCELLED },
      { new: true },
    );

    if (!matchDeleted) throw new NotFoundException();

    return matchDeleted;
  };

  leaveMatch = async (id: Types.ObjectId, user: Types.ObjectId) => {
    const match = await this.matchModel.findOneAndUpdate(
      {
        _id: id,
        joined: user,
        $or: [{ status: MatchStatus.WAITING }, { status: MatchStatus.RUNNING }],
      },
      { $pull: { joined: user } },
      { new: true },
    );

    if (!match) throw new NotFoundException('NO_MATCH_FOUND');

    return match;
  };

  addUserToMatch = (id: Types.ObjectId, user: Types.ObjectId) => {
    return this.matchModel.findOneAndUpdate(
      {
        _id: id,
        $or: [{ status: MatchStatus.WAITING }, { status: MatchStatus.RUNNING }],
        joined: { $ne: user },
      },
      { $addToSet: { joined: user } },
      { new: true },
    );
  };

  verifyUserInMatch = async (
    matchId: Types.ObjectId,
    userId: Types.ObjectId,
  ) => {
    return this.matchModel.findOne({
      _id: matchId,
      $or: [
        { user: userId }, // El usuario es el creador del match
        { joined: userId }, // El usuario está en el array de joined
      ],
    });
  };

  getPlayersInMatch = async (id: Types.ObjectId): Promise<Types.ObjectId[]> => {
    const match = await this.getMatch(id);

    const players = match.joined;

    players.push(match.user);

    return players;
  };

  getAllPlayerMatches = async (
    user: Types.ObjectId,
    payload: PlayerMatchesFiltersDto,
    limit: number = 10,
  ) => {
    const filters: any[] = [{ $or: [{ user }, { joined: user }] }];

    if (payload.platform) {
      filters.push({ platform: payload.platform });
    } else {
      filters.push({ platform: { $ne: null } });
    }

    if (payload.status && payload.status.length > 0) {
      filters.push({ status: { $in: payload.status } });
    }

    const sortField: string = payload.sortBy;
    const sortOrderVal = payload.sort === 'asc' ? 1 : -1;
    const sort: any = { [sortField]: sortOrderVal };
    if (sortField !== '_id') {
      sort._id = sortOrderVal;
    }

    if (payload.cursor) {
      if (!Types.ObjectId.isValid(payload.cursor)) {
        throw new BadRequestException('invalid_cursor');
      }
      const cursorMatch = await this.matchModel.findById(payload.cursor).lean();
      if (cursorMatch) {
        const cursorValue = cursorMatch[sortField];
        const cursorId = cursorMatch._id;

        const cursorFilter =
          sortOrderVal === -1
            ? {
                $or: [
                  { [sortField]: { $lt: cursorValue } },
                  { _id: { $lt: cursorId } },
                ],
              }
            : {
                $or: [
                  { [sortField]: { $gt: cursorValue } },
                  { _id: { $gt: cursorId } },
                ],
              };
        filters.push(cursorFilter);
      }
    }

    const query = { $and: filters };

    const matches = await this.matchModel
      .find(query, {})
      .sort(sort)
      .limit(limit);

    return matches;
  };

  getPlayerMatches = async (
    user: Types.ObjectId,
    payload: PlayerMatchesFiltersDto,
  ) => {
    switch (payload.type) {
      case MatchesTypeFilter.ALL:
        return this.getAllPlayerMatches(user, payload);
      case MatchesTypeFilter.CREATED:
        return this.getMatchesCreatedByPlayer(user, payload);
      case MatchesTypeFilter.JOINED:
        return this.getMatchesWithUserJoined(user, payload);
    }
  };

  getMatchesCreatedByPlayer = async (
    user: Types.ObjectId,
    payload: PlayerMatchesFiltersDto,
    limit: number = 10,
  ) => {
    const filters: any[] = [{ user }];

    const sortField: string = payload.sortBy || 'date';
    const sortOrderVal = payload.sort === 'asc' ? 1 : -1;
    const sort: any = { [sortField]: sortOrderVal };
    if (sortField !== '_id') {
      sort._id = sortOrderVal;
    }

    if (payload.cursor) {
      if (!Types.ObjectId.isValid(payload.cursor)) {
        throw new BadRequestException('invalid_cursor');
      }
      const cursorMatch = await this.matchModel.findById(payload.cursor).lean();
      if (cursorMatch) {
        const cursorValue = cursorMatch[sortField];
        const cursorId = cursorMatch._id;

        const cursorFilter =
          sortOrderVal === -1
            ? {
                $or: [
                  { [sortField]: { $lt: cursorValue } },
                  { _id: { $lt: cursorId } },
                ],
              }
            : {
                $or: [
                  { [sortField]: { $gt: cursorValue } },
                  { _id: { $gt: cursorId } },
                ],
              };
        filters.push(cursorFilter);
      }
    }

    const query = filters.length > 1 ? { $and: filters } : filters[0];

    const matches = await this.matchModel
      .find(query, {})
      .sort(sort)
      .limit(limit);

    return matches;
  };

  getPlayerInvitations = async (user: string, skip: number = 0) =>
    this.matchModel.find(
      { inviteds: user },
      {},
      { populate: { path: 'game' }, skip },
    );

  getMatchesByPlatform = async (
    platform: number,
    skip: number = 0,
    limit: number = 30, // Default limit of 10 documents
  ): Promise<MatchesByPlatforms[]> => {
    const results = await this.matchModel.aggregate([
      {
        $match: {
          platform,
          $or: [
            { status: MatchStatus.RUNNING },
            { status: MatchStatus.WAITING },
          ],
        },
      },
      {
        $lookup: {
          from: 'games',
          localField: 'game',
          foreignField: '_id',
          as: 'gameDetails',
        },
      },
      {
        $unwind: '$gameDetails',
      },
      {
        $group: {
          _id: '$gameDetails._id',
          count: { $sum: 1 },
          name: { $first: '$gameDetails.name' },
          background: { $first: '$gameDetails.background' },
          slug: { $first: '$gameDetails.slug' },
        },
      },
      {
        $sort: {
          count: -1,
          name: -1,
        },
      },
      {
        $skip: skip * limit,
      },
      {
        $limit: limit, // Add the limit stage
      },
    ]);

    return results;
  };

  getMatchesByPlatformParent = async (
    parent: PlatformParent,
    skip: number,
    limit: number,
  ) => {
    const platforms = await this.platformsService.getByParent(parent);

    // Fetch all platform matches in parallel
    const platformMatches = await Promise.all(
      platforms.map(async (platform) => {
        const matches = await this.getMatchesByPlatform(
          platform.apiId,
          skip,
          limit,
        );
        return {
          name: platform.name,
          slug: platform.slug,
          apiId: platform.apiId,
          matches,
        };
      }),
    );

    // Sort by matchCount in descending order
    return platformMatches.sort((a, b) => b.matches.length - a.matches.length);
  };

  getMatchesWithUserJoined = async (
    userId: Types.ObjectId,
    payload: PlayerMatchesFiltersDto,
    limit: number = 10,
  ) => {
    const filters: any[] = [{ joined: userId }];

    const sortField: string = payload.sortBy || 'date';
    const sortOrderVal = payload.sort === 'asc' ? 1 : -1;
    const sort: any = { [sortField]: sortOrderVal };
    if (sortField !== '_id') {
      sort._id = sortOrderVal;
    }

    if (payload.cursor) {
      if (!Types.ObjectId.isValid(payload.cursor)) {
        throw new BadRequestException('invalid_cursor');
      }
      const cursorMatch = await this.matchModel.findById(payload.cursor).lean();
      if (cursorMatch) {
        const cursorValue = cursorMatch[sortField];
        const cursorId = cursorMatch._id;

        const cursorFilter =
          sortOrderVal === -1
            ? {
                $or: [
                  { [sortField]: { $lt: cursorValue } },
                  { _id: { $lt: cursorId } },
                ],
              }
            : {
                $or: [
                  { [sortField]: { $gt: cursorValue } },
                  { _id: { $gt: cursorId } },
                ],
              };
        filters.push(cursorFilter);
      }
    }

    const query = filters.length > 1 ? { $and: filters } : filters[0];

    const matches = await this.matchModel
      .find(query, {})
      .sort(sort)
      .limit(limit);

    return matches;
  };

  getActiveMatchesJoinedOrCreatedByUser = (userId: Types.ObjectId) =>
    this.matchModel.find(
      {
        $or: [
          { status: MatchStatus.RUNNING },
          { status: MatchStatus.WAITING },
          { $or: [{ user: userId }, { joined: userId }] },
        ],
      },
      {},
      { sort: { _id: -1 } },
    );

  getMatchesByGameAndPlatform = async (
    platform: number,
    game: string,
    skip: number = 0,
  ) =>
    this.matchModel.find(
      { platform, game, status: { $ne: MatchStatus.FINISHED } },
      {},
      { skip, sort: { date: 1 }, limit: 20 },
    );

  getMatchesByGameSlugAndPlatform = async (
    platform: number,
    gameSlug: string,
    skip: number = 0,
  ) => {
    const game = await this.gamesService.findBySlug(gameSlug);

    return this.matchModel.find(
      { platform, game: game._id, status: { $ne: MatchStatus.FINISHED } },
      {},
      { skip, sort: { date: 1 }, limit: 20 },
    );
  };

  updatePastTimeMatches = async (): Promise<Array<Match>> => {
    const currentTime = new Date();

    const matches = await this.matchModel.find({
      status: MatchStatus.WAITING,
      date: { $lt: currentTime },
    });

    await this.matchModel.updateMany(
      {
        status: MatchStatus.WAITING,
        date: { $lt: currentTime },
      },
      { status: MatchStatus.RUNNING },
    );

    await this.matchModel.updateMany(
      {
        status: { $in: [MatchStatus.RUNNING, MatchStatus.WAITING] },
        $expr: {
          $lt: [
            {
              $add: ['$date', { $multiply: ['$duration', 60000] }],
            },
            currentTime,
          ],
        },
      },
      { status: MatchStatus.FINISHED },
    );

    return matches;
  };

  async recommendGamesForPlatform(
    user: string,
    platform: Platform,
  ): Promise<GameInterface[] | unknown> {
    const recentGames = await this.getLatestGamesByUserAndPlatform(
      user,
      platform,
    );

    if (recentGames.length >= 5) return recentGames;

    const rawgGames = await this.gamesService.searchGames({
      platforms: platform.toString(),
      tags: 'online',
      search: '',
      key: '',
    });

    return rawgGames;
  }

  async getLatestGamesByUserAndPlatform(
    user: string,
    platform: Platform,
  ): Promise<any> {
    if (!Types.ObjectId.isValid(user)) {
      throw new BadRequestException('invalid_user_id');
    }

    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const gameIdsByFrequency = await this.matchModel.aggregate([
      {
        $match: {
          $or: [{ user: user }, { joined: user }],
          platform,
          createdAt: { $gte: ninetyDaysAgo },
        },
      },
      {
        $group: {
          _id: '$game',
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ]);

    if (gameIdsByFrequency.length === 0) {
      return [];
    }

    const sortedGameIds = gameIdsByFrequency.map((item) => item._id);

    const games = await this.gamesService.getGamesInfo(sortedGameIds);

    // The `getGamesInfo` service might not return games in the sorted order from the aggregation.
    // We need to re-sort them based on the `sortedGameIds` order.
    const gameMap = new Map(games.map((game) => [game._id.toString(), game]));
    const sortedGames = sortedGameIds
      .map((id) => gameMap.get(id.toString()))
      .filter((game) => game !== undefined);

    return sortedGames;
  }

  deleteUserFromMatches = async (user: Types.ObjectId) => {
    try {
      await this.matchModel.deleteMany({ user });
      await this.matchModel.updateMany(
        {
          joined: user,
          inviteds: user,
        },
        { $pull: { joined: user, inviteds: user } },
      );
    } catch (error) {
      Logger.error(error);
    } finally {
    }
  };

  findAllActive = () =>
    this.matchModel
      .find({
        $or: [{ status: MatchStatus.WAITING }, { status: MatchStatus.RUNNING }],
      })
      .exec();

  getUserMatchesByPlatform = async (id: Types.ObjectId) => {
    const user = await this.usersService.findOneById(id);

    const platformMatches = await Promise.all(
      user.platforms.map(async (platform) => {
        return {
          platform,
          games: await this.getMatchesByPlatform(platform),
        };
      }),
    );

    platformMatches.sort((a, b) => b.games.length - a.games.length);

    return platformMatches;
  };
}
