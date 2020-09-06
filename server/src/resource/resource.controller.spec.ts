import { Test, TestingModule } from '@nestjs/testing';
import { ResourceController } from './resource.controller';

describe('Resource Controller', () => {
  let controller: ResourceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResourceController],
    }).compile();

    controller = module.get<ResourceController>(ResourceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
