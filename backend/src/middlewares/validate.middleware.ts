import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';

export const validate = (schema: ZodObject<any, any>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error) {
            if (error instanceof ZodError || (error as any).name === 'ZodError') {
                const zodError = error as ZodError;
                res.status(400).json({
                    message: 'Validation failed',
                    errors: zodError.issues.map((issue) => ({
                        path: issue.path.join('.').replace('body.', ''),
                        message: issue.message,
                    })),
                });
                return;
            }
            next(error);
        }
    };
};
