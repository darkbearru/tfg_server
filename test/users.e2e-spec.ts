import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { disconnect } from 'mongoose';

const userDTO: CreateUserDto = {
	login: 'test2@test.ru',
	name: 'Test User',
	password: 'test123',
};

describe('Users (e2e)', () => {
	let app: INestApplication;
	let userId: string;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.setGlobalPrefix('api');
		await app.init();
	});

	it('/users/ (POST, Success)', async () => {
		return request(app.getHttpServer())
			.post('/api/users/')
			.send(userDTO)
			.expect(201)
			.then(({ body }: request.Response) => {
				expect(body._id).toBeDefined();
				expect(body.email).toBe(userDTO.login);
				userId = body._id;
				return;
			});
	});

	it('/users/ (POST, Fail)', () => {
		return request(app.getHttpServer()).post('/api/users/').send(userDTO).expect(400);
	});

	it('/users/ (DELETE, Success)', () => {
		return request(app.getHttpServer()).delete(`/api/users/${userId}`).expect(200);
	});

	it('/users/ (DELETE, Fail)', () => {
		return request(app.getHttpServer()).delete(`/api/users/${userId}`).expect(404);
	});

	afterAll(async () => {
		return disconnect();
	});
});
