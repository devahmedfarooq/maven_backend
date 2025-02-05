import { Test, TestingModule } from '@nestjs/testing';
import { EcommerceController } from './ecommerce.controller';
import { EcommerceService } from './ecommerce.service';

describe('EcommerceController', () => {
  let controller: EcommerceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EcommerceController],
      providers: [EcommerceService],
    }).compile();

    controller = module.get<EcommerceController>(EcommerceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
