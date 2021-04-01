import { ok } from '@alexshelkov/result';
import {
  creator,
  Handler,
  GetService,
  loggerService
} from '@alexshelkov/lambda';
import slackTransportService from '../../slack';

const res = creator(slackTransportService).srv(loggerService);

type Service = GetService<typeof res>;

const handler: Handler<Service, string, never> = async ({ service: { logger } }) => {
  logger.log('say hello');

  return ok(`hello: ${new Date().toISOString().split('T')[1].slice(0, 8)}`);
};

export const handle = res.ok(handler).req();
