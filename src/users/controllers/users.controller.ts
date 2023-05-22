import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDTO, UpdateUserDTO } from '../dto/user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MongoIdPipe } from '../../common/mongo-id/mongo-id.pipe';

type UserResponse = {
  _id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt?: Date;
};

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users', description: 'Get all users' })
  getUsers(): Promise<UserResponse[]> {
    return this.usersService.getAllUsers();
  }

  @Post()
  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User Already Exists',
  })
  createUser(@Body() user: CreateUserDTO): Promise<UserResponse> {
    return this.usersService.createUser(user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User Does Not Exist',
  })
  updateUser(
    @Param('id', MongoIdPipe) id: string,
    @Body() userPayload: UpdateUserDTO,
  ): Promise<UserResponse> {
    return this.usersService.updateUser({ userId: id }, userPayload);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User Does Not Exist',
  })
  deleteUser(@Param('id', MongoIdPipe) id: string): Promise<UserResponse> {
    return this.usersService.deleteUser(id);
  }

  @Get(':email')
  @ApiOperation({ summary: 'Get a user by email' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User Does Not Exist',
  })
  getUserByEmail(@Param('email') email: string): Promise<UserResponse> {
    return this.usersService.getUserByEmail(email);
  }
}
