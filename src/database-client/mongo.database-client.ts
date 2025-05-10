import {inject, injectable} from 'inversify';
import mongoose, {Mongoose} from 'mongoose';
import {setTimeout} from 'node:timers/promises';
import {DatabaseClient} from './database-client.interface.js';
import {Logger} from '../logger/logger.interface.js';
import {Component} from '../types/component.enum.js';

const RETRY_COUNT = 5;
const RETRY_TIMEOUT = 1000;

@injectable()
export default class MongoClientService implements DatabaseClient {
  private isConnected = false;
  private mongooseInstance: Mongoose | null = null;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger
  ) {}

  private async _connectWithRetry(uri: string): Promise<Mongoose> {
    let attempt = 0;

    while (attempt < RETRY_COUNT) {
      try {
        return await mongoose.connect(uri);
      } catch (error) {
        attempt++;
        this.logger.error(`Database connection failed (attempt ${attempt}).`);
        await setTimeout(RETRY_TIMEOUT);
      }
    }

    this.logger.error(`Database connection failed after ${attempt} attempts.`);
    throw new Error('Database connection failed.');
  }

  private async _connect(uri: string): Promise<void> {
    this.mongooseInstance = await this._connectWithRetry(uri);
    this.isConnected = true;
  }

  private async _disconnect(): Promise<void> {
    await this.mongooseInstance?.disconnect();
    this.isConnected = false;
    this.mongooseInstance = null;
  }

  public async connect(uri: string): Promise<void> {
    if (this.isConnected) {
      throw new Error('MongoDB client is already connected to a database.');
    }
    this.logger.info('Connecting to MongoDB...');
    await this._connect(uri);
    this.logger.info('Database connection established!');
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Database connection not established.');
    }
    await this._disconnect();
    this.logger.info('Database connection terminated.');
  }
}
