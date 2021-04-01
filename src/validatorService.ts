import { MiddlewareCreator, JsonBodyService, addService } from '@alexshelkov/lambda';
import { ObjectSchema } from 'yup';

type ValidatorService = {
  isValid: boolean;
};
type ValidatorServiceOptions = {};
type ValidatorServiceErrors = never;

const validatorService = (
  schema: ObjectSchema<any>
): MiddlewareCreator<
  ValidatorServiceOptions,
  ValidatorService,
  ValidatorServiceErrors,
  JsonBodyService
> => {
  return () => {
    return async (request) => {
      const {
        service: { jsonBody },
      } = request;

      const isValid = await schema.isValid(jsonBody);

      return addService(request, { isValid });
    };
  };
};

export default validatorService;
