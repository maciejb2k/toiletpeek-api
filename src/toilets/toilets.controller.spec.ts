import { Test, TestingModule } from '@nestjs/testing';
import { ToiletsController } from './toilets.controller';
import { ToiletsService } from './toilets.service';

describe('ToiletsController', () => {
  let controller: ToiletsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ToiletsController],
      providers: [ToiletsService],
    }).compile();

    controller = module.get<ToiletsController>(ToiletsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
