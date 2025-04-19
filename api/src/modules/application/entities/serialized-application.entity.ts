import { Application } from './application.entity';
import { Exclude } from 'class-transformer';

export class SerializedApplication extends Application {
  constructor(partial: Partial<SerializedApplication>) {
    super(partial);
  }
}
