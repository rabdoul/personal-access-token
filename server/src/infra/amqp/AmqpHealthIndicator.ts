import { AmqpClient } from 'amqplib-rt';

import { Health, HealthIndicator } from '../../application/HealthIndicator';

export class AmqpHealthIndicator implements HealthIndicator {

  constructor(private readonly amqpClient: AmqpClient) { }

  name(): string {
    return 'rabbitmq';
  }

  async health(): Promise<Health> {
    return this.amqpClient.isConnected()
      .then(connected => connected ? Health.OK : Health.KO)
      .catch(_ => Health.KO)
  }
}
