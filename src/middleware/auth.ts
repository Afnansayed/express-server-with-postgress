import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';

const auth = (...routes: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(500).json({ message: 'You are not allowed!!' });
      }
      const decodedToken = jwt.verify(
        token,
        config.jwtSecret as string
      ) as JwtPayload;
      console.log({ decodedToken });
      if (routes.length && !routes.includes(decodedToken.role)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      next();
    } catch (err: any) {
      console.error('Authentication error:', err);
      res.status(401).json({ message: err.message || 'Unauthorized' });
    }
  };
};

export default auth;
