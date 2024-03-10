import { Test, TestingModule } from '@nestjs/testing';
import { ToiletsGateway } from './toilets.gateway';

describe('ToiletsGateway', () => {
  let gateway: ToiletsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ToiletsGateway],
    }).compile();

    gateway = module.get<ToiletsGateway>(ToiletsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
