import { Job, Worker, QueueEvents } from 'bullmq';
import { StockHistoryService } from './stock-history.service';
import {
  OnModuleInit,
  OnModuleDestroy,
  Logger,
  Injectable,
} from '@nestjs/common';

// Define the job data interface for type safety
interface StockHistoryJobData {
  productId: number;
  quantity: number;
  actionType: 'increase' | 'decrease' | 'clear';
  lastQuantity: number;
}
@Injectable()
export class StockHistoryProcessor implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(StockHistoryProcessor.name);
  private worker: Worker;
  private queueEvents: QueueEvents;

  constructor(private stockHistoryService: StockHistoryService) {}

  async onModuleInit() {
    const connection = {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      //   password: process.env.REDIS_PASSWORD,
    };

    // Initialize queue events listener
    this.queueEvents = new QueueEvents('stock-queue', { connection });

    // Create the worker with proper typing and connection
    this.worker = new Worker<StockHistoryJobData>(
      'stock-queue',
      async (job: Job<StockHistoryJobData>) => {
        try {
          const { productId, quantity, actionType, lastQuantity } = job.data;

          this.logger.debug(
            `Processing stock history action for product ${productId}`,
            { actionType, quantity, lastQuantity },
          );

          // Call the service to create the stock history action
          await this.stockHistoryService.createStockHistoryAction(
            actionType,
            productId,
            quantity,
            lastQuantity,
          );

          this.logger.debug(
            `Successfully processed stock history action for product ${productId}`,
          );
        } catch (error) {
          this.logger.error(
            `Failed to process stock history action: ${error.message}`,
            error.stack,
          );
          throw error; // Re-throw to trigger the failed event
        }
      },
      {
        connection,
        concurrency: parseInt(process.env.STOCK_QUEUE_CONCURRENCY || '5'),
        removeOnComplete: {
          count: 1000, // Keep the last 1000 completed jobs
          age: 24 * 3600, // Keep completed jobs for 24 hours
        },
        removeOnFail: {
          count: 5000, // Keep more failed jobs for debugging
        },
        lockDuration: 30000, // 30 seconds lock duration
      },
    );

    // Set up event handlers
    this.worker.on('completed', (job) => {
      this.logger.debug(`Job ${job.id} completed successfully`);
    });

    this.worker.on('failed', (job, error) => {
      this.logger.error(`Job ${job.id} failed: ${error.message}`, error.stack);
    });

    this.worker.on('error', (error) => {
      this.logger.error(
        `Worker encountered an error: ${error.message}`,
        error.stack,
      );
    });

    // Monitor stalled jobs
    this.queueEvents.on('stalled', ({ jobId }) => {
      this.logger.warn(`Job ${jobId} has stalled`);
    });

    this.logger.log('Stock history processor initialized successfully');
  }

  async onModuleDestroy() {
    this.logger.log('Shutting down stock history processor...');

    try {
      await this.worker.close();
      await this.queueEvents.close();
      this.logger.log('Stock history processor shut down successfully');
    } catch (error) {
      this.logger.error(
        `Error shutting down stock history processor: ${error.message}`,
        error.stack,
      );
    }
  }
}
// async handleStockUpdate(job: Job) {
//   const { productId, quantity, actionType, lastQuantity } = job.data;

//   await this.stockHistoryService.createStockHistoryAction(
//     actionType,
//     productId,
//     quantity,
//     lastQuantity,
//   );
// }
