import { Test, TestingModule } from '@nestjs/testing';
import { ClerkAuthService } from './clerk-auth.service';

describe('ClerkAuthService', () => {
  let service: ClerkAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClerkAuthService],
    }).compile();

    service = module.get<ClerkAuthService>(ClerkAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
