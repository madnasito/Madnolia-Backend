import mongoose, { HydratedDocument } from 'mongoose';
export type GameDocument = HydratedDocument<Game>;
export declare class Game {
    name: string;
    slug: string;
    gameId: number;
    platforms: [
        {
            id: number;
            amount: number;
        }
    ];
    background: string;
    screenshots: String[];
    description: string;
}
export declare const GameSchema: mongoose.Schema<Game, mongoose.Model<Game, any, any, any, mongoose.Document<unknown, any, Game> & Game & {
    _id: mongoose.Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Game, mongoose.Document<unknown, {}, mongoose.FlatRecord<Game>> & mongoose.FlatRecord<Game> & {
    _id: mongoose.Types.ObjectId;
}>;
