import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Req,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';
import { AccessTokenGuard } from './guards/accessToken.guard';
import { RefreshTokenGuard } from './guards/refreshToken.guard';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UsePipes(new ValidationPipe())
	@Post('login')
	@HttpCode(HttpStatus.OK)
	async login(@Body() dto: LoginDto) {
		return await this.authService.login(dto);
	}

	@UseGuards(AccessTokenGuard)
	@Get('logout')
	async logout(@Req() req: Request) {
		return await this.authService.logout(req.user['id']);
	}

	@UseGuards(RefreshTokenGuard)
	@Get('refresh')
	refreshTokens(@Req() req: Request) {
		const userId = req.user['id'];
		const refreshToken = req.user['refreshToken'];
		return this.authService.refreshTokens(userId, refreshToken);
	}
}
