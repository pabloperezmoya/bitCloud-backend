import { Controller, Get, HttpStatus, Request } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { ApiDocs } from '../../common/apiDoc/apidocs.decoratos';
import { JwtPayload } from '../../common/types';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserResponse } from '../../common/responses';

import { ApiResponseBuilder } from '../../common/responses';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiDocs({
    operationSummary: 'Get a data user by a userId',
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
}
