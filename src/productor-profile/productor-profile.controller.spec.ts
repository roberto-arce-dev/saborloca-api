import { Test, TestingModule } from '@nestjs/testing';
import { ProductorProfileController } from './productor-profile.controller';

describe('ProductorProfileController', () => {
  let controller: ProductorProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductorProfileController],
    }).compile();

    controller = module.get<ProductorProfileController>(ProductorProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
