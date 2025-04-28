import { Test, TestingModule } from '@nestjs/testing';
import { VertupayService } from './vertupay.service';

describe('VertupayService', () => {
  let service: VertupayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VertupayService],
    }).compile();

    service = module.get<VertupayService>(VertupayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
