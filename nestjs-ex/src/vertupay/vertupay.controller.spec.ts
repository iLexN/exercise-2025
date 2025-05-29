import { Test, TestingModule } from '@nestjs/testing';
import { VertupayController } from './vertupay.controller';

describe('VertupayController', () => {
  let controller: VertupayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VertupayController],
    }).compile();

    controller = module.get<VertupayController>(VertupayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
