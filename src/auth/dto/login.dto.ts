import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
	@IsString()
	@IsEmail()
	login: string;

	@IsString()
	password: string;
}
