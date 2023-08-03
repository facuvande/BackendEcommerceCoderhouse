export const validateBody = (validator) => (req, res, next) => {
    console.log(req.body.file)
    const validatedBody =  validator(req.body);
    req.body = validatedBody;
    next();
};

export const validateParams = (validator) => (req, res, next) => {
    const validatedParams = validator(req.params);
    req.body = validatedParams;
    next();
};

export const validateQuery = (validator) => (req, res, next) => {
    const validatedQuery = validator(req.query);
    req.query = validatedQuery;
    next();
};
