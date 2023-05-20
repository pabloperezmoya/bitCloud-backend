import {
  Controller,
  Post,
  Body,
  //UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
//import { AuthGuard } from './auth.guard';
import { Public } from './decorators/public.decorator';
import { SignInDto, SignUpDto } from './dtos/auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { AccessTokenResponse, ApiResponseBuilder } from 'src/common/responses';
import { ApiDocs } from 'src/common/apiDoc/apidocs.decoratos';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Public()
  @Get('register')
  @ApiDocs({
    operationSummary: 'Register a user',
    operationDescription: 'Register a user and return a JWT token',
    responseStatus: 201,
    responseDescription: 'JWT token',
    responseType: AccessTokenResponse,
  })
  register(@Body() signUpDto: SignUpDto) {
    const accessToken = this.authService.signUp(signUpDto);
    return new ApiResponseBuilder().data({ access_token: accessToken }).build();
  }
}
