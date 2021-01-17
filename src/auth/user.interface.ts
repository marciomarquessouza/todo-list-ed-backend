import { Request } from 'express';

export interface IUser {
  id: number;
  name: string;
  email: string;
}

export interface IRequest extends Request {
  user: IUser;
}
