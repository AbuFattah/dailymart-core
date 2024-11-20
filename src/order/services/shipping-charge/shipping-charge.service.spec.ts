import { Test, TestingModule } from '@nestjs/testing';
import { ShippingChargeService } from './shipping-charge.service';

describe('ShippingChargeService', () => {
  let service: ShippingChargeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShippingChargeService],
    }).compile();

    service = module.get<ShippingChargeService>(ShippingChargeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
