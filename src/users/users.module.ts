import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from './model/user.model';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: UserModel.name,
				schema: UserSchema,
				collection: 'User',
			},
		]),
	],
	providers: [UsersService],
	controllers: [UsersController],
})
export class UsersModule {}
