
import { IsDateString, IsNotEmpty } from 'class-validator';

export class GetMessagesFromDto {
  @IsNotEmpty()
  @IsDateString()
  date: string;
}
