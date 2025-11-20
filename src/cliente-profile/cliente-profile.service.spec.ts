import { Test, TestingModule } from '@nestjs/testing';
import { ClienteProfileService } from './cliente-profile.service';

describe('ClienteProfileService', () => {
  let service: ClienteProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClienteProfileService],
    }).compile();

    service = module.get<ClienteProfileService>(ClienteProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
