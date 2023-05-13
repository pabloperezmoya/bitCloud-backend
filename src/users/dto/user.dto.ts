import { IsEmail, IsString, Length } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UserDTO {
  @IsString()
  @ApiProperty({ example: 'John Doe' })
  name: string;

  @IsEmail()
  @ApiProperty({ example: 'jhon@doe.com' })
  readonly email: string;
}

export class CreateUserDTO {
  @IsString()
  @ApiProperty({ example: 'John Doe' })
  name: string;

  @IsEmail()
  @ApiProperty({ example: 'jhon@doe.com' })
  readonly email: string;

  @IsString()
  @Length(6)
  @ApiProperty({ example: '123456' })
  password: string;
}

export class UpdateUserDTO extends PartialType(CreateUserDTO) {}
