import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Post,
  Query,
  Request,
} from '@nestjs/common';

import { ApiDocs } from '../../common/apiDoc/apidocs.decoratos';
import { JwtPayload } from '../../common/types';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import {
  ApiResponseBuilder,
  FolderResponse,
  FolderResponseArray,
  UUIDResponse,
} from '../../common/responses';
import { FoldersService } from '../services/folders.service';

import { FolderNamePipe } from '../pipes/pipes.pipe';

@ApiTags('folders')
@ApiBearerAuth()
@Controller('folders')
export class FoldersController {
  constructor(private foldersService: FoldersService) {}

  @Get()
  @ApiDocs({
    operationSummary: 'Get All folders of a user by a userId',
    operationDescription:
      '## Get All folders of a user by a userId embedded in the JWT token \n' +
      '📥 Receive ➡️ JWT Token (Header🔒) <br/> ' +
      '📦 Returns ➡️ FileDocument[]',
    responseStatus: HttpStatus.OK,
    responseDescription: 'OK',
    responseType: FolderResponseArray,
    queryParameters: [
      {
        name: 'populate',
        description:
          'Populate the folder with files. Must be true or false. By default is false',
        required: false,
      },
    ],
  })
  async getAllUserFolders(
    @Request() req: JwtPayload,
    @Query('populate') populate?: boolean,
  ) {
    let folders;
    try {
      folders = await this.foldersService.getAllUserFolders(
        req.user.sub,
        populate,
      );
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
    return new ApiResponseBuilder().data({ folders }).build();
  }

  @Get(':folderName')
  @ApiDocs({
    operationSummary: 'Get a folder of a user by a userId',
    operationDescription:
      '## Get a folder of a user by a userId embedded in the JWT token \n' +
      '📥 Receive ➡️ JWT Token (Header🔒) + folderName parameter <br/> ' +
      '📦 Returns ➡️ FileDocument',
    responseStatus: HttpStatus.OK,
    responseDescription: 'OK',
    responseType: FolderResponse,
  })
  async getUserFolder(
    @Request() req: JwtPayload,
    @Param('folderName', FolderNamePipe) folderName: string,
    @Query('populate') populate?: boolean,
  ) {
    let folder;
    try {
      folder = await this.foldersService.getFolder(
        req.user.sub,
        folderName,
        populate,
      );
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
    return new ApiResponseBuilder().data({ folder }).build();
  }

  @Post(':folderName')
  @ApiDocs({
    operationSummary: 'Create a folder for a user by a userId',
    operationDescription:
      '## Create a folder for a user by a userId embedded in the JWT token \n' +
      '📥 Receive ➡️ JWT Token (Header🔒) <br/> ' +
      '📦 Returns ➡️ FileDocument',
    responseStatus: HttpStatus.CREATED,
    responseDescription: 'Created',
    responseType: UUIDResponse,
  })
  @ApiParam({
    name: 'folderName',
    description: 'Name of the folder to be created',
    type: String,
  })
  async createUserFolder(
    @Request() req: JwtPayload,
    @Param('folderName', FolderNamePipe)
    folderName: string,
  ) {
    let folderId;
    try {
      folderId = await this.foldersService.createUserFolder(
        req.user.sub,
        folderName,
      );
    } catch (err) {
      throw new InternalServerErrorException(err);
    }

    return new ApiResponseBuilder().data({ folderId }).build();
  }
}
