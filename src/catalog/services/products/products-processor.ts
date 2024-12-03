import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ProductsService } from './products.service';

interface NameUpdateData {
  id: string;
  name: string;
}

@Processor('products-queue')
export class ProductsConsumer extends WorkerHost {
  constructor(private productService: ProductsService) {
    super();
  }

  async process(job: Job<NameUpdateData>): Promise<any> {
    try {
      const { id, name } = job.data;

      if (job.name === 'update-category-name') {
        await this.productService.updateProductCategoryNameById(id, name);
      } else if (job.name === 'update-subcategory-name') {
        await this.productService.updateProductSubcategoryNameById(id, name);
      }
    } catch (error) {
      console.error(`Job ${job.id} failed:`, error);
      // trigger retry
      throw error;
    }
  }
}
