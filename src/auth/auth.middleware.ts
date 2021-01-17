import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request } from 'express';
import { jwtConfig } from '../config/jwt.config';
import { IUser } from './user.interface';

const jwt = require('jsonwebtoken');

interface IRequest extends Request {
  user: IUser;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: IRequest, _, next: NextFunction) {
    const authHeader = req.headers?.authorization;

    if (authHeader) {
      const token = authHeader.replace(/^Bearer\s+/, '');
      jwt.verify(token, jwtConfig.secret, (err, decoded: IUser) => {
        if (err) {
          throw new UnauthorizedException('Invalid Token');
        }
        const { id, email, name } = decoded;
        req.user = { id, email, name };
        next();
      });
    } else {
      throw new UnauthorizedException();
    }
  }
}
