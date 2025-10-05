import { IsArray, IsNotEmpty, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class MultipleMongoIdsDto {
  @IsArray()
  @IsNotEmpty()
  @IsMongoId({ each: true })
  ids: Types.ObjectId[];
}
