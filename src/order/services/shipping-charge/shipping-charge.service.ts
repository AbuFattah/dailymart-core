import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShippingCharge } from 'src/order/typeorm/entities/ShippingCharge.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ShippingChargeService {
  constructor(
    @InjectRepository(ShippingCharge)
    private shippingRepository: Repository<ShippingCharge>,
  ) {}

  async getShippingOptions() {
    return await this.shippingRepository.find();
  }

  async getShippingChargeById(id: number): Promise<number> {
    const data = await this.shippingRepository.findOne({ where: { id: id } });

    return data.charge;
  }
}
