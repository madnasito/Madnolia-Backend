import { ObjectId } from "mongoose";
export declare class MatchDto {
    _id: ObjectId;
    title: string;
    user: string;
    platform: number;
    game: string;
    date: number;
    inviteds: Array<string>;
    likes: Array<String>;
    tournament: boolean;
}
