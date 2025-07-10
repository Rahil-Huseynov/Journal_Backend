import { IsInt, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  problems: string;

  @IsInt()
  userJournalId: number;
}
