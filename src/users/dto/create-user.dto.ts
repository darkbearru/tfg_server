import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
	@IsString()
	@IsEmail()
	login: string;

	@IsString()
	name: string;

	@IsString()
	@MinLength(5)
	password: string;
}
