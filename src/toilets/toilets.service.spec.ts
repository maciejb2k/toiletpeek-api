import { Test, TestingModule } from '@nestjs/testing';
import { ToiletsService } from './toilets.service';

describe('ToiletsService', () => {
  let service: ToiletsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ToiletsService],
    }).compile();

    service = module.get<ToiletsService>(ToiletsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
