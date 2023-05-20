import { Express } from 'express';

import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Request,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
  Res,
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';

import { StorageService } from '../services/storage.service';
import { type JwtPayload } from 'src/common/types';
import {
  ApiResponse as ApiResponseType,
  UUIDResponse,
  DocumentResponse,
  DocumentResponseArray,
  URLResponse,
} from 'src/common/responses';
import { ApiResponseBuilder } from 'src/common/responses';
import {
  ApiExceptionBuilder,
  FileNotFoundException,
  InternalServerErrorException,
} from 'src/common/exceptions';
import { ApiDocs } from 'src/common/apiDoc/apidocs.decoratos';
import { FileUploadDto } from '../dtos';

@Controller('storage')
@ApiTags('storage')
@ApiBearerAuth()
export class StorageController {
  constructor(private storageService: StorageService) {}

  // Upload a file to user storage
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.CREATED)
  @ApiDocs({
    operationSummary: 'Upload a file to user storage',
    operationDescription:
      '## Upload every type of file, it must be uploaded by multipart/form-data \n' +
      '📥 Receive ➡️ JWT Token (Header🔒), Multipart/form-data File (Body) <br/> ' +
      '📦 Returns ➡️ fileId: uuid',
    responseStatus: HttpStatus.CREATED,
    responseDescription: 'Returns the fileId of the uploaded file',
    responseType: UUIDResponse,
    bodyDescription:
      'Select the file to be uploaded, it must be uploaded by multipart/form-data',
    bodyType: FileUploadDto,
    consume: 'multipart/form-data',
  })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: JwtPayload,
  ): Promise<UUIDResponse | ApiResponseType> {
    let fileId;
    try {
      // check if user exists

      // Save file to user storage
      fileId = await this.storageService.saveFile(file);
      // Save to database the storageKey, userID(ref), originalName, mimetype, size.
      await this.storageService.saveToDatabase(fileId, req.user.sub, file);
    } catch (err) {
      // If a error occurs, delete the file from user storage
      if (fileId) {
        await this.storageService.deleteFile(fileId);
      }
      // Throw a error
      throw new InternalServerErrorException();
    }

    return new ApiResponseBuilder().data({ fileId }).build();
  }

  @Delete(':fileId')
  @HttpCode(HttpStatus.OK)
  @ApiDocs({
    operationSummary: 'Delete a file from user storage',
    operationDescription:
      '## Delete a file from user storage \n' +
      '📥 Receive ➡️ JWT Token (Header🔒), fileId (Param) <br/> ' +
      '📦 Returns ➡️ Message: Deleted',
    responseStatus: HttpStatus.OK,
    responseDescription: 'Deleted',
    responseType: ApiResponseType,
  })
  async deleteFile(
    @Request() req: JwtPayload,
    @Param('fileId') fileId: string,
  ): Promise<ApiResponseType> {
    // Delete file from database
    const dbRecord = await this.storageService.deleteFileFromDatabase(
      req.user.sub,
      fileId,
    );

    if (dbRecord.deletedCount === 0) {
      throw new Error();
    }
    // Delete file from storage
    const deletedBinary = await this.storageService.deleteFile(fileId);
    console.log({ deletedBinary });
    if (!deletedBinary) {
      throw new Error();
    }

    return new ApiResponseBuilder().message('Deleted').build();
  }

  @Get('files')
  @HttpCode(HttpStatus.OK)
  @ApiDocs({
    operationSummary: 'Get all files from user storage',
    operationDescription:
      '## Get all files from user storage \n' +
      '📥 Receive ➡️ JWT Token (Header🔒), skip (Query), limit (Query) <br/> ' +
      '📦 Returns ➡️ Array of files',
    responseStatus: HttpStatus.OK,
    responseDescription: 'OK',
    responseType: DocumentResponseArray,
    queryParameters: [
      {
        name: 'skip',
        required: false,
        description: 'Number of documents to skip',
      },
      {
        name: 'limit',
        required: false,
        description: 'Max quantity of documents per request',
      },
    ],
  })
  async getAllMyFiles(
    @Request() req: JwtPayload,
    @Query('skip') skip?: number,
    @Query('limit') limit?: number,
  ): Promise<DocumentResponseArray | ApiResponseType> {
    const data = await this.storageService.getAllMyFiles(
      req.user.sub,
      skip,
      limit,
    );
    if (!data) {
      throw new FileNotFoundException();
    }
    return new ApiResponseBuilder().data(data).build();
  }

  @Get('files/shared')
  @HttpCode(HttpStatus.OK)
  @ApiDocs({
    operationSummary: 'Get all files shared with user',
    operationDescription:
      '## Get all files shared with user \n' +
      '📥 Receive ➡️ JWT Token (Header🔒), skip (Query), limit (Query) <br/> ' +
      '📦 Returns ➡️ Array of files',
    responseStatus: HttpStatus.OK,
    responseDescription: 'OK: Returns an array of documents',
    responseType: DocumentResponseArray,
    queryParameters: [
      {
        name: 'skip',
        required: false,
        description: 'Number of documents to skip',
      },
      {
        name: 'limit',
        required: false,
        description: 'Max quantity of documents per request',
      },
    ],
  })
  async getAllSharedFiles(
    @Request() req: JwtPayload,
    @Query('skip') skip: number,
    @Query('limit') limit: number,
  ): Promise<DocumentResponseArray | ApiResponseType> {
    const data = await this.storageService.getAllSharedFiles(
      req.user.sub,
      skip,
      limit,
    );
    if (!data) {
      throw new FileNotFoundException();
    }

    return new ApiResponseBuilder().data(data).build();
  }

  @Get('files/:fileId')
  @HttpCode(HttpStatus.OK)
  @ApiDocs({
    operationSummary: 'Get a file from user storage',
    operationDescription:
      '## Get a file from user storage \n' +
      '📥 Receive ➡️ JWT Token (Header🔒), fileId (Param) <br/> ' +
      '📦 Returns ➡️ FileDocument',
    responseStatus: HttpStatus.OK,
    responseDescription: 'OK',
    responseType: DocumentResponse,
  })
  async getFile(
    @Request() req: JwtPayload,
    @Param('fileId') fileId: string,
  ): Promise<DocumentResponse | ApiResponseType> {
    const dbRecord = await this.storageService.getFile(req.user.sub, fileId);
    if (!dbRecord) {
      throw new FileNotFoundException();
    }
    return new ApiResponseBuilder().data(dbRecord).build();
  }

  @Get('files/:fileId/stream')
  @HttpCode(HttpStatus.OK)
  @ApiDocs({
    operationSummary: 'Stream a file from user storage',
    operationDescription:
      '## Stream a file from user storage \n' +
      '📥 Receive ➡️ JWT Token (Header🔒), fileId (Param) <br/> ' +
      '📦 Returns ➡️ FileStream',
    responseStatus: HttpStatus.OK,
    responseDescription: 'OK',
    responseType: StreamableFile,
  })
  async streamFile(
    @Request() req: JwtPayload,
    @Param('fileId') fileId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const dbRecord = await this.storageService.getFile(req.user.sub, fileId);
    if (!dbRecord) {
      throw new FileNotFoundException();
    }

    const stream = await this.storageService.streamFile(dbRecord.fileKey);
    res.set({
      'Content-Type': dbRecord.mimetype,
    });
    return new StreamableFile(
      (await stream.transformToByteArray()) as Uint8Array,
    );
  }

  @Get('files/:fileId/public')
  @HttpCode(HttpStatus.OK)
  @ApiDocs({
    operationSummary: 'Get a public link to the file (it expires)',
    operationDescription:
      '## Get a public link to the file (it expires) \n' +
      '📥 Receive ➡️ JWT Token (Header🔒), fileId (Param), expiresIn (Query) <br/> ' +
      '📦 Returns ➡️ Public URL',
    responseStatus: HttpStatus.OK,
    responseDescription: 'OK',
    responseType: URLResponse,
    queryParameters: [
      {
        name: 'expiresIn',
        required: false,
        description: 'Time in seconds for the link to expire',
      },
    ],
  })
  async makeFilePublic(
    @Request() req: JwtPayload,
    @Param('fileId') fileId: string,
    @Query('expiresIn') expiresIn: number,
  ): Promise<URLResponse | ApiResponseType> {
    const dbRecord = await this.storageService.getFile(req.user.sub, fileId);
    if (!dbRecord) {
      throw new FileNotFoundException();
    }
    const publicUrl = await this.storageService.makeFilePublic(
      dbRecord.fileKey,
      expiresIn,
    );
    return new ApiResponseBuilder().data(publicUrl).build();
  }

  @Get('files/:fileId/share')
  @HttpCode(HttpStatus.OK)
  @ApiDocs({
    operationSummary: 'Create a share for a file',
    operationDescription:
      '## Create a share for a file \n' +
      '📥 Receive ➡️ JWT Token (Header🔒), fileId (Param) <br/> ' +
      '📦 Returns ➡️ ShareId',
    responseStatus: HttpStatus.OK,
    responseDescription: 'OK',
    responseType: UUIDResponse,
  })
  async createShare(
    @Request() req: JwtPayload,
    @Param('fileId') fileId: string,
  ): Promise<UUIDResponse | ApiResponseType> {
    const dbRecord = await this.storageService.getFile(req.user.sub, fileId);
    if (!dbRecord) {
      throw new FileNotFoundException();
    }
    // check if already has a shareId
    if (dbRecord.shareId) {
      return new ApiResponseBuilder()
        .data({ shareId: dbRecord.shareId })
        .build();
    }
    const shareId = await this.storageService.createShare(dbRecord.fileKey);

    return new ApiResponseBuilder().data({ shareId }).build();
  }

  @Get('files/:fileId/share/:shareId')
  @HttpCode(HttpStatus.OK)
  @ApiDocs({
    operationSummary: 'Get a file from a share',
    operationDescription:
      '## Get a file from a share, it add the userId to the fileDocument \n' +
      '📥 Receive ➡️ JWT Token (Header🔒), fileId (Param), shareId (Param) <br/> ' +
      '📦 Returns ➡️ FileDocument',
    responseStatus: HttpStatus.OK,
    responseDescription: 'OK',
    responseType: DocumentResponse,
  })
  async getShare(
    @Request() req: JwtPayload,
    @Param('fileId') fileId: string,
    @Param('shareId') shareId: string,
  ): Promise<DocumentResponse | ApiResponseType> {
    const dbRecord = await this.storageService.getFileByShareId(shareId);
    if (!dbRecord) {
      throw new FileNotFoundException();
    }
    if (dbRecord.fileKey !== fileId) {
      throw new FileNotFoundException();
    }

    // Avoid sharing with yourself
    if (dbRecord.userId.toString() === req.user.sub) {
      throw new ApiExceptionBuilder(HttpStatus.BAD_REQUEST)
        .message('Cannot share with yourself')
        .build();
    }

    // check if user already has access to file
    if (dbRecord.sharedWith.includes(req.user.sub)) {
      return new ApiResponseBuilder().data(dbRecord).build();
    }

    // append req.user.userId to storageFileDocument
    await this.storageService.addUserToFileDocument(fileId, req.user.sub);

    return new ApiResponseBuilder().data(dbRecord).build();
  }

  @Patch('files/:fileId/share/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiDocs({
    operationSummary: 'Revoke share to a user',
    operationDescription:
      '## Revoke share to a user \n' +
      '📥 Receive ➡️ JWT Token (Header🔒), fileId (Param), userId (Param) <br/> ' +
      '📦 Returns ➡️ Message: Revoked Access',
    responseStatus: HttpStatus.OK,
    responseDescription: 'OK',
    responseType: ApiResponseType,
  })
  async revokeShare(
    @Request() req: JwtPayload,
    @Param('fileId') fileId: string,
    @Param('userId') userId: string,
  ): Promise<ApiResponseType> {
    const dbRecord = await this.storageService.getFile(req.user.sub, fileId);
    if (!dbRecord) {
      throw new FileNotFoundException();
    }

    // Check if user has access to file
    if (dbRecord.userId.toString() !== req.user.sub) {
      throw new ApiExceptionBuilder(HttpStatus.FORBIDDEN)
        .message('You do not have access to this file')
        .build();
    }

    // delete the :userId (from the share) from the storageFileDocument of the user that is getting the file
    await this.storageService.removeUserFromFileDocument(fileId, userId);
    return new ApiResponseBuilder().message('Revoked Access').build();
  }

  @Delete('files/:fileId/share')
  @HttpCode(HttpStatus.OK)
  @ApiDocs({
    operationSummary: 'Delete a share',
    operationDescription:
      '## Delete a share \n' +
      '📥 Receive ➡️ JWT Token (Header🔒), fileId (Param) <br/> ' +
      '📦 Returns ➡️ Message: 1 resources deleted',
    responseStatus: HttpStatus.OK,
    responseDescription: 'OK',
    responseType: ApiResponseType,
  })
  async deleteShare(
    @Request() req: JwtPayload,
    @Param('fileId') fileId: string,
  ): Promise<ApiResponseType> {
    let deletedCounter = 0;
    const dbRecord = await this.storageService.getFile(req.user.sub, fileId);
    if (!dbRecord) {
      throw new FileNotFoundException();
    }
    // If shareId already exists, delete it
    if (dbRecord?.shareId) {
      // delete the shareId from the storageFileDocument of the user that is getting the file
      await this.storageService.deleteShareIdFromFileDocument(dbRecord.fileKey);
      deletedCounter++;
    }
    // If sharedWith array contains elements, unset it all
    if (dbRecord?.sharedWith.length > 0) {
      await this.storageService.deleteSharedWithFromFileDocument(
        dbRecord.fileKey,
      );
      deletedCounter++;
    }

    return new ApiResponseBuilder()
      .message(`${deletedCounter} resources deleted`)
      .build();
  }
}
