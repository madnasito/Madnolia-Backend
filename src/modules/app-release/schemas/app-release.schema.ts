import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ReleaseChangesDto } from "../dtos/release-changes.dto";
import { ReleasePlatform } from "../enums/release-platform.enum";

@Schema()
export class AppRelease {
    @Prop({ required: true })
    version: string;

    @Prop({ required: true })
    codeVersion: number;

    @Prop({ required: true })
    platform: ReleasePlatform;

    @Prop({ required: true })
    mandatory: boolean;

    @Prop({ type: [ReleaseChangesDto], required: true })
    changes: ReleaseChangesDto[];

    @Prop({ required: true })
    createdAt: Date;
}

export const AppReleaseSchema = SchemaFactory.createForClass(AppRelease);