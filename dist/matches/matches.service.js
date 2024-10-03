"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const match_schema_1 = require("./schemas/match.schema");
const mongoose_2 = require("mongoose");
const games_service_1 = require("../games/games.service");
const messages_service_1 = require("../messages/messages.service");
let MatchesService = class MatchesService {
    constructor(matchModel, gamesService, messagesService) {
        this.matchModel = matchModel;
        this.gamesService = gamesService;
        this.messagesService = messagesService;
        this.create = async (createMatchDto, user) => {
            const gameData = await this.gamesService.getGame(createMatchDto.game);
            let newMatch = {
                date: createMatchDto.date,
                game: gameData._id,
                inviteds: createMatchDto.inviteds,
                platform: createMatchDto.platform,
                title: createMatchDto.title,
                tournament: false,
                user: user
            };
            const createdMatch = new this.matchModel(newMatch);
            const matchDb = await createdMatch.save();
            return matchDb;
        };
        this.getMatch = async (id) => {
            if (!mongoose_2.default.Types.ObjectId.isValid(id))
                throw new common_1.NotFoundException();
            return this.matchModel.findById(id);
        };
        this.getMatchWithGame = async (id) => {
            if (!mongoose_2.default.Types.ObjectId.isValid(id))
                throw new common_1.NotFoundException();
            return this.matchModel.findOne({ _id: id }, {}, { populate: { path: 'game' } });
        };
        this.getFullMatch = async (id) => {
            if (!mongoose_2.default.Types.ObjectId.isValid(id))
                throw new common_1.NotFoundException();
            const match = await this.matchModel.findOne({ _id: id }, {}, {
                populate: [
                    { path: 'game' },
                    { path: 'likes', select: '_id name thumb username' }
                ],
            });
            if (!match)
                throw new common_1.NotFoundException();
            const messages = await this.messagesService.getRoomMessages(id);
            return { match, messages };
        };
        this.update = async (user, attrs) => {
            const match = await this.matchModel.findOne({ _id: attrs._id, user, active: true });
            if (!match)
                throw new common_1.NotFoundException('Match not found');
            Object.assign(match, attrs);
            return match.save();
        };
        this.delete = async (id, user) => {
            if (!mongoose_2.default.Types.ObjectId.isValid(id))
                throw new common_1.NotFoundException();
            const matchDeleted = await this.matchModel.findOneAndUpdate({ _id: id, active: true, user }, { active: false }, { new: true });
            if (!matchDeleted)
                throw new common_1.NotFoundException();
            return matchDeleted;
        };
        this.addUserToMatch = (id, user) => {
            if (!mongoose_2.default.Types.ObjectId.isValid(id) || !mongoose_2.default.Types.ObjectId.isValid(user))
                throw new common_1.NotFoundException();
            return this.matchModel.findByIdAndUpdate(id, { $addToSet: { likes: user } }, { new: true });
        };
        this.getPlayerMatches = async (user, skip = 0) => this.matchModel.find({ user }, {}, { populate: { path: 'game' } }).sort({ _id: -1 }).skip(0);
        this.getPlayerInvitations = async (user, skip = 0) => {
            return this.matchModel.find({ inviteds: user }, {}, { populate: { path: 'game' } });
        };
        this.getMatchesByPlatform = async (platform, skip = 0) => {
            const results = await this.matchModel.aggregate([
                {
                    $match: {
                        platform,
                        active: true,
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
                    },
                },
            ]);
            return results;
        };
        this.getMatchesByGameAndPlatform = async (platform, game, skip = 0) => this.matchModel.find({ platform, game, active: true }, {}, { skip });
        this.updatePastTimeMatches = async () => {
            const matchesToUpdate = await this.matchModel.find({ active: true, date: { $lt: new Date().getTime() } });
            await this.matchModel.updateMany({ date: { $lt: new Date().getTime() }, active: true }, { active: false });
            return matchesToUpdate;
        };
    }
};
exports.MatchesService = MatchesService;
exports.MatchesService = MatchesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(match_schema_1.Match.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        games_service_1.GamesService,
        messages_service_1.MessagesService])
], MatchesService);
//# sourceMappingURL=matches.service.js.map