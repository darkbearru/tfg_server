import { JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export const getJwtConfig = async (configService: ConfigService): Promise<JwtModuleOptions> => {
	return {
		secret: configService.get<string>('JWT_SECRET'),
		signOptions: {
			expiresIn: configService.get<string>('JWT_EXPIRES'),
		},
	};
};
