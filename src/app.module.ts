import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getMongoConfig } from './configs/mongo.config';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
	imports: [
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getMongoConfig,
		}),
		ConfigModule.forRoot(),
		UsersModule,
		AuthModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
