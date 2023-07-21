import * as z from 'zod';
import CustomError from '../errors/custom.error.js'
import ErrorEnum from '../errors/errors.enum.js';

export const validator = (schema) => (maybeValid) => {
    const result = schema.safeParse(maybeValid);
    if (!result.success) {
        // throw new ValidatorError(result.error.errors);
        CustomError.createError({
        name: 'ValidationError',
        cause: result.error.errors,
        message: JSON.stringify(result.error.errors.map(e => ({
            property: e.path.join('.'),
            issue: e.message,
        }))),
        code: ErrorEnum.INVALID_TYPES_ERROR,
        })
    }
    return result.data;
};
