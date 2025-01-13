import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument, UserModel } from './model/user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { genSalt, hash } from 'bcryptjs';
import { USER_DELETE_ERROR, USER_EXISTS_ERROR, USER_NOT_FOUND_ERROR } from './users.contants';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(UserModel.name)
		private readonly userModel: Model<UserDocument>,
	) {}

	async create(dto: CreateUserDto) {
		if (await this.userModel.findOne({ email: dto.login })) {
			throw new HttpException(USER_EXISTS_ERROR, HttpStatus.BAD_REQUEST);
		}
		try {
			const salt = await genSalt(10);
			const newUser = new this.userModel({
				email: dto.login,
				name: dto.name,
				isActive: true,
				passwordHash: await hash(dto.password, salt),
			});
			return await newUser.save();
		} catch (error) {
			console.error(error);
			throw new HttpException(USER_EXISTS_ERROR, HttpStatus.BAD_REQUEST);
		}
	}

	async update(id: string, dto: UpdateUserDto) {
		await this.checkUserById(id);
		try {
			return await this.userModel.findByIdAndUpdate(id, dto);
		} catch (error) {
			console.error(error);
			throw new NotFoundException(USER_NOT_FOUND_ERROR);
		}
	}

	async delete(id: string) {
		await this.checkUserById(id);
		try {
			return await this.userModel.deleteOne({ _id: id }).exec();
		} catch (error) {
			console.error(error);
			throw new NotFoundException(USER_DELETE_ERROR);
		}
	}

	async findByEmail(email: string) {
		return this.userModel.findOne({ email, isActive: true });
	}

	async findById(id: string) {
		return this.userModel.findById(id);
	}

	private async checkUserById(id: string) {
		if (!(await this.userModel.findOne({ _id: id }))) {
			throw new NotFoundException(USER_NOT_FOUND_ERROR);
		}
	}
}
