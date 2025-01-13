import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { JwtPayload } from '../../types/jwt.types';
import * as process from 'node:process';

export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env?.JWT_REFRESH_SECRET,
		});
	}

	validate(req: Request, payload: JwtPayload) {
		const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
		return { ...payload, refreshToken };
	}
}
