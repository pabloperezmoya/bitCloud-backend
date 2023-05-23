import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsObject, IsOptional, IsString } from 'class-validator';
import { StorageFile } from '../../storage/entities/storage.entity';
import { User } from '../../users/entities/user.entity';

export class ApiResponse {
  @IsBoolean()
  @ApiProperty({ default: true, example: true })
  success: boolean;

  @IsString()
  @ApiProperty({ example: 'OK' })
  @IsOptional()
  message?: string;

  @IsObject()
  @IsOptional()
  //@ApiProperty({ example: 'object | object[]' })
  data?: object | object[];
}

export class ApiResponseBuilder {
  private readonly response: ApiResponse;
  constructor() {
    this.response = {
      success: true,
      message: 'OK',
    };
  }

  message(message: string): ApiResponseBuilder {
    this.response.message = message;
    return this;
  }

  data(data: object | object[]): ApiResponseBuilder {
    this.response.data = data;
    return this;
  }

  build(): ApiResponse {
    return this.response;
  }
}

export class DocumentResponse extends ApiResponse {
  @IsObject()
  @ApiProperty({
    example: {
      sharedWith: [],
      _id: '645fef803211adfed5XXXXXX',
      fileKey: '98cbb91e-2da1-YYYY-XXXX-7d14547356f0',
      userId: 'XXXXXf845ad7a17139a17fff',
      mimetype: 'image/jpeg',
      size: 163181,
      createdAt: '2023-05-13T20:13:52.279Z',
      __v: 0,
    },
  })
  data?: StorageFile;
}

export class UserResponse extends ApiResponse {
  @IsObject()
  @ApiProperty({
    example: {
      _id: '646bc8e8f7ba2b44XXXXXXX',
      userId: 'user_2QA9BZZZZZZZZZZZZZZ',
      name: 'John',
      email: 'test@test.com',
      password: '$2b$10$SXXXXXXSSSSSSS',
      createdAt: '2023-05-22T19:56:21.248Z',
      authMethod: 'clerkdev',
      folders: [],
      __v: 0,
      updatedAt: '2023-05-22T19:58:21.219Z',
    },
  })
  data?: User;
}

export class UserPropertyResponse extends ApiResponse {
  @IsObject()
  @ApiProperty({
    example: {
      name: 'John',
    },
  })
  data?: Partial<User>;
}

export class DocumentResponseArray extends ApiResponse {
  @IsObject()
  @ApiProperty({
    example: [
      {
        sharedWith: [],
        _id: '645fef803211adfed5XXXXXX',
        fileKey: '98cbb91e-2da1-YYYY-XXXX-7d14547356f0',
        userId: 'XXXXXf845ad7a17139a17fff',
        mimetype: 'image/jpeg',
        size: 163181,
        createdAt: '2023-05-13T20:13:52.279Z',
        __v: 0,
      },
      {
        sharedWith: [],
        _id: '645fef803211adfed5XXXXXX',
        fileKey: '98cbb91e-2da1-YYYY-XXXX-7d14547356f0',
        userId: 'XXXXXf845ad7a17139a17fff',
        mimetype: 'image/jpeg',
        size: 163181,
        createdAt: '2023-05-13T20:13:52.279Z',
        __v: 0,
      },
    ],
  })
  data?: StorageFile[];
}

export class UUIDResponse extends ApiResponse {
  @IsObject()
  @ApiProperty({ example: { Id: '98cbb91e-XXXX-YYYY-ZZZZ-7d14547356f0' } })
  data?: {
    Id: string;
  };
}

export class ObjectIdResponse extends ApiResponse {
  @IsObject()
  @ApiProperty({ example: { Id: '64541f845ad7a171XXXXXXXX' } })
  data?: {
    Id: string;
  };
}

export class URLResponse extends ApiResponse {
  @IsObject()
  @ApiProperty({ example: { url: 'https://zzzz.yyyy.com' } })
  data?: {
    url: string;
  };
}

export class AccessTokenResponse extends ApiResponse {
  @IsObject()
  @ApiProperty({
    example: {
      access_token:
        'eyXXXXXXXXXXXXXXXXXXXXX.eyJZZZZZZZZZZZZIjY0NjE0NmQ1YzU1M2YxZTRmNmU1MWMzYiIsImlhdCI6MTY4NDZZZZZZZfQ.aFgoCNrq6PHYYYYYYYYYYYYYYYYYYY0Q',
    },
  })
  data?: {
    access_token: string;
  };
}
