import { AmqpClient, AmqpConfiguration } from "amqplib-rt";

import { ExpressServer } from "./interface/ExpressServer";
import { AmqpHealthIndicator } from "./infra/amqp/AmqpHealthIndicator";
import { RABBITMQ_URL } from "./infra/amqp/rabbitmq.config";
import { AmqpCommandQueryExecutor } from "./infra/amqp/AmqpCommandQueryExecutor";
import { Auth0Authentication } from "./infra/auth0/Auth0Authentication";
import { TheFeatureFlippingConfig } from "./infra/featureflipping/feature-flipping.config";


const amqpOptions = { requestedHeartbeat: 5, connectionTimeout: 2000, replyTimeout: 20000 };
const amqpClient = new AmqpClient(new AmqpConfiguration(RABBITMQ_URL, "cutting-room-production-process", amqpOptions));

const healthIndicators = [new AmqpHealthIndicator(amqpClient)];

const commandQueryExecutor = new AmqpCommandQueryExecutor(amqpClient);
const authentication = new Auth0Authentication(commandQueryExecutor);

const featureFlippingConfig = new TheFeatureFlippingConfig();

new ExpressServer(healthIndicators, authentication, featureFlippingConfig, commandQueryExecutor).start();
