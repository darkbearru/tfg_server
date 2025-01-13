import {
	Body,
	Controller,
	Delete,
	Param,
	Patch,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@UsePipes(new ValidationPipe())
	@Post()
	async create(@Body() dto: CreateUserDto) {
		return await this.usersService.create(dto);
	}

	@UsePipes(new ValidationPipe())
	@Patch(':id')
	async update(id: string, dto: UpdateUserDto) {
		return await this.usersService.update(id, dto);
	}

	@UsePipes(new ValidationPipe())
	@Delete(':id')
	async delete(@Param('id') id: string) {
		return await this.usersService.delete(id);
	}
}
