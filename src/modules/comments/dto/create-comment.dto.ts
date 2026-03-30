import { IsString, IsNotEmpty, IsInt, MinLength, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(1000)
  text: string;

  @IsInt()
  @IsNotEmpty()
  postId: number;
}