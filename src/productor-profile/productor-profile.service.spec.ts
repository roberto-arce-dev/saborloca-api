import { Test, TestingModule } from '@nestjs/testing';
import { ProductorProfileService } from './productor-profile.service';

describe('ProductorProfileService', () => {
  let service: ProductorProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductorProfileService],
    }).compile();

    service = module.get<ProductorProfileService>(ProductorProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
