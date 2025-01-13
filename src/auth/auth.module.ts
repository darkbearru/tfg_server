import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from '../users/model/user.model';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: UserModel.name,
				schema: UserSchema,
				collection: 'User',
			},
		]),
		JwtModule.register({}),
	],
	controllers: [AuthController],
	providers: [AuthService, UsersService, ConfigService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
