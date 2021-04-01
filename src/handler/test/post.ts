import { creator, loggerService, Handler, jsonBodyService, GetService } from '@alexshelkov/lambda';
import { ok, fail } from '@alexshelkov/result';
import slackTransportService from '../../slack';
import validatorService from '../../validatorService';
import * as yup from 'yup';

const schema = yup.object().shape({
  name: yup.string().required()
});

const res = creator(slackTransportService)
  .srv(loggerService)
  .srv(jsonBodyService)
  .srv(validatorService(schema));

type Service = GetService<typeof res>;

const handler: Handler<Service, string, 'ValidationError'> = async ({
  service: { jsonBody, logger, isValid },
}) => {
  const body = JSON.stringify(jsonBody);

  if (!isValid) {
    logger.error(`Invalid data: ${body}`);
    // return fail('ValidationError');
  } else {
    logger.log(`Body from post: [${body}]`);
  }

  return ok(body);
};

export const handle = res.ok(handler).req();
