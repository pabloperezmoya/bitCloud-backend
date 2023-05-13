import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UsersService } from './users.service';
import { User } from '../entities/user.entity';

const mockUser = {
  name: 'Alice',
  email: 'alice@email.com',
  password: '12345678',
};
describe('UsersService', () => {
  let service: UsersService;
  let userModel: Model<User>;

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
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: {
            find: jest.fn().mockResolvedValue(mockUser), // definimos que cada
            exec: jest.fn(), // No  definimos su comportamiento aún
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      jest.spyOn(userModel, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(userArray), // Simulate a database call
      } as any);
      expect(await service.getAllUsers()).toBe(userArray); // getAllUsers por detrás ejecuta userModel.find().exec(). Cuando se ejecuta .exec() se devuelve userArray (mockResolvedValueOnce)
    });
  });
});
