import { IsBoolean, IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class JoinLiveMatchRoomDto {
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  match: string;

  @IsBoolean()
  @IsNotEmpty()
  audio: boolean;

  @IsBoolean()
  @IsNotEmpty()
  video: boolean;
}