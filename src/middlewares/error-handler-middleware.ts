import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function handleErrors(err: Error, _req: Request, res: Response, next: NextFunction) {
  if (err.name === 'NotFoundError') {
    return res.status(httpStatus.NOT_FOUND).send({
      message: err.message,
    });
  }

  if (err.name === 'badRequestError') {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: err.message,
    });
  }

  console.error(err);
  res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
    error: 'InternalServerError',
    message: 'Internal Server Error',
  });
}
