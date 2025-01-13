import {
	ForbiddenException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { USER_NO_ACCESS_ERROR, USER_NOT_FOUND_ERROR } from '../users/users.contants';
import { compare, genSalt, hash } from 'bcryptjs';
import { AUTH_WRONG_PASSWORD_ERROR } from './auth.constants';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../types/jwt.types';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService,
	) {}

	async login({ login, password }: LoginDto) {
		const payload: JwtPayload = await this.validateUser(login, password);
		const tokens = await this.getTokens(payload);
		await this.updateRefreshToken(payload, tokens.refreshToken);
		return tokens;
	}

	async logout(id: string) {
		return await this.usersService.update(id, { refreshToken: null });
	}

	async validateUser(login: string, password: string): Promise<JwtPayload> {
		const user = await this.usersService.findByEmail(login);
		if (!user) {
			throw new NotFoundException(USER_NOT_FOUND_ERROR);
		}
		const isCorrectPassword = await compare(password, user.passwordHash);
		if (!isCorrectPassword) {
			throw new UnauthorizedException(AUTH_WRONG_PASSWORD_ERROR);
		}
		return { id: user.id, email: user.email, name: user.name };
	}

	async refreshTokens(id: string, refreshToken: string) {
		const user = await this.usersService.findById(id);
		if (!user || !user.refreshToken) throw new ForbiddenException(USER_NO_ACCESS_ERROR);
		const isCorrectToken = await compare(refreshToken, user.refreshToken);
		if (!isCorrectToken) throw new ForbiddenException(USER_NO_ACCESS_ERROR);
		const payload = { id: user.id, email: user.email, name: user.name };
		const tokens = await this.getTokens(payload);
		await this.updateRefreshToken(user.id, tokens.refreshToken);
		return tokens;
	}

	private async updateRefreshToken(payload: JwtPayload, refreshToken: string): Promise<void> {
		const salt = await genSalt(10);
		const refreshTokenHash = await hash(refreshToken, salt);
		await this.usersService.update(payload.id, { refreshToken: refreshTokenHash });
	}

	private async getTokens(payload: JwtPayload) {
		const [accessToken, refreshToken] = await Promise.all([
			this.getAccessToken(payload),
			this.getRefreshToken(payload),
		]);
		return {
			accessToken,
			refreshToken,
		};
	}

	private async getAccessToken(payload: JwtPayload) {
		return this.jwtService.signAsync(payload, {
			secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
			expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES'),
		});
	}

	private async getRefreshToken(payload: JwtPayload) {
		return this.jwtService.signAsync(payload, {
			secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
			expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES'),
		});
	}
}
