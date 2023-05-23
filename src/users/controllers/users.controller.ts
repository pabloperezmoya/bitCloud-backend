import {
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { ApiDocs } from 'src/common/apiDoc/apidocs.decoratos';
import { JwtPayload } from '../../common/types';
import { ApiTags } from '@nestjs/swagger';
import {
  DocumentResponse,
  UserPropertyResponse,
  UserResponse,
} from '../../common/responses';

import { ApiResponseBuilder } from '../../common/responses';
import { exec } from 'child_process';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiDocs({
    operationSummary: 'Get a user by a userId',
    operationDescription:
      '## Get a user by a userId embedded in the JWT token \n' +
      '📥 Receive ➡️ JWT Token (Header🔒) <br/> ' +
      '📦 Returns ➡️ FileDocument',
    responseStatus: HttpStatus.OK,
    responseDescription: 'OK',
    responseType: UserResponse,
  })
  async getUserData(@Request() req: JwtPayload) {
    const user = await this.usersService.getUser({ userId: req.user.sub });
    return new ApiResponseBuilder().data(user).build();
  }

  @Get('folders')
  @ApiDocs({
    operationSummary: 'Get folders of a user by a userId',
    operationDescription:
      '## Get folders of a user by a userId embedded in the JWT token \n' +
      '📥 Receive ➡️ JWT Token (Header🔒) <br/> ' +
      '📦 Returns ➡️ FileDocument[]',
    responseStatus: HttpStatus.OK,
    responseDescription: 'OK',
    responseType: UserPropertyResponse,
  })
  async getUserFolders(@Request() req: JwtPayload) {
    let folders;
    try {
      folders = await this.usersService.getUserFolders(req.user.sub);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
    return new ApiResponseBuilder().data({ folders }).build();
  }

  @Post('folders/:folderName')
  @ApiDocs({
    operationSummary: 'Create a folder for a user by a userId',
    operationDescription:
      '## Create a folder for a user by a userId embedded in the JWT token \n' +
      '📥 Receive ➡️ JWT Token (Header🔒) <br/> ' +
      '📦 Returns ➡️ FileDocument',
    responseStatus: HttpStatus.CREATED,
    responseDescription: 'Created',
  })
  async createUserFolder(
    @Request() req: JwtPayload,
    @Param('folderName') folderName: string,
  ) {
    try {
      await this.usersService.createUserFolder(req.user.sub, folderName);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }

    return new ApiResponseBuilder().build();
  }
}
