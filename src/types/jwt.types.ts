import { UserModel } from '../users/model/user.model';

export type JwtPayload = Pick<UserModel, 'name' | 'email'> & { id: string };
