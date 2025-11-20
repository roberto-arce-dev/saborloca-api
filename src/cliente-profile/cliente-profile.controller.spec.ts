import { Test, TestingModule } from '@nestjs/testing';
import { ClienteProfileController } from './cliente-profile.controller';

describe('ClienteProfileController', () => {
  let controller: ClienteProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClienteProfileController],
    }).compile();

    controller = module.get<ClienteProfileController>(ClienteProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
