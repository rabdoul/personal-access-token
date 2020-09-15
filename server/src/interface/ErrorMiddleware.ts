import * as express from 'express';

export default function errorMiddleware(error: Error, req: express.Request, res: express.Response, _: express.NextFunction) {
  const message: string = error.message || 'Something went wrong';
  res.status(500).json({ message });
}
