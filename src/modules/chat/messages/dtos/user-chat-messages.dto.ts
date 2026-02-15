import { IsMongoId, IsOptional } from 'class-validator';

export class UserChatDto {
  @IsMongoId({ message: 'INVALID_USER_CHAT' })
  conversation: string;

  @IsOptional()
  @IsMongoId()
  cursor?: string;
}
