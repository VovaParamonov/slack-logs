import { IncomingWebhook } from '@slack/webhook';
import { addService, MiddlewareCreator, TransportService } from '@alexshelkov/lambda';

const url = 'https://hooks.slack.com/services/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';

type SlackTransportService = TransportService;
type SlackTransportOptions = {};
type SlackTransportErrors = { type: 'SlackConnectionError' } & Error;

type MessageType = string;

const slackTransportService: MiddlewareCreator<
  SlackTransportOptions,
  SlackTransportService,
  SlackTransportErrors
  > = () => {
  const promises: Promise<unknown>[] = [];

  try {
    const webhook = new IncomingWebhook(url);

    function slackSend(...textBlocks: string[]) {
      return webhook.send({
        text: textBlocks
          .reduce((accum, cur) => `[${accum}] [${cur}]`)
      });
    }

    const send: (type: MessageType, data: unknown[], meta: Record<string, unknown>) => void = async (type, data) => {
      if (type === 'error') {
        promises.push(slackSend("Error:", ...data as string[]));
      } else if (type === 'warn') {
        promises.push(slackSend("warn:", ...data as string[]));
      } else if (type === 'debug') {
        promises.push(slackSend("debug:", ...data as string[]));
      } else if (type === 'info') {
        promises.push(slackSend("info:", ...data as string[]));
      } else {
        promises.push(slackSend(...data as string[]));
      }
    }

    return async (request, { destroy }) => {
      destroy(async () => {
        await Promise.all(promises)
      });

      return addService(request, {
        transport: {
          send
        }
      })
    }
  } catch (e) {
    return fail('SlackConnectionError');
  }
}

export default slackTransportService;