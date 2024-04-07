import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {User} from "./models/user.model";
import * as bcrypt from 'bcrypt'
import {CreateUserDTO} from "./dto";

type TUser = {
	firstName: string;
	username: string;
	email: string;
	password: string;
}

@Injectable()
export class UserService {
	constructor(@InjectModel(User) private readonly userRepository: typeof User) {}

	async hashPassword(password) {
		return bcrypt.hash(password, 10)
	}
	async findUserByEmail(email: string) {
		return this.userRepository.findOne({rejectOnEmpty: undefined, where: { email } })
	}

	async createUser(dto: CreateUserDTO): Promise<CreateUserDTO> {

		dto.password = await this.hashPassword(dto.password);
		const newUser: TUser = {
			firstName: dto.firstName,
			username: dto.username,
			email: dto.email,
			password: dto.password
		}
		await this.userRepository.create(newUser);
		return dto;
	}
}
