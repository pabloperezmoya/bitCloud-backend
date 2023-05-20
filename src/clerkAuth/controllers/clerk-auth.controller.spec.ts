import { Test, TestingModule } from '@nestjs/testing';
import { ClerkAuthController } from './clerk-auth.controller';

describe('ClerkAuthController', () => {
  let controller: ClerkAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClerkAuthController],
    }).compile();

    controller = module.get<ClerkAuthController>(ClerkAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
