import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'jhon@doe.com' })
  email: string;

  @IsString()
  @Length(6)
  @ApiProperty({ example: '123456' })
  password: string;
}
