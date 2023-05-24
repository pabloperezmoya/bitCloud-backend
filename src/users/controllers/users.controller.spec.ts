import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';

// const mockUser = {
//   name: 'Alice',
//   email: 'alice@email.com',
//   password: '12345678',
// };

describe('UsersController', () => {
  let controller: UsersController;
  //let service: UsersService;
  const userArray = [
    {
      name: 'Alice',
      email: 'alice@email.com',
      password: '12345678',
    },
    {
      name: 'John',
      email: 'john@email.com',
      password: '12345678',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: UsersService,
          useValue: {
            getAllUsers: jest.fn().mockResolvedValue([...userArray]),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    //service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      //expect(controller.getUsers()).resolves.toEqual([...userArray]);
    });
  });
});
