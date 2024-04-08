import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./models/user.model";
import * as bcrypt from 'bcrypt'
import {CreateUserDTO, UpdateUserDTO} from "./dto";
import passport from "passport";

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
		return newUser;
	}
	async updateUser(email: string, dto: UpdateUserDTO): Promise<UpdateUserDTO> {
		await this.userRepository.update(dto, {returning: undefined, where: {email}});
		return dto;
	}

	async deleteUser(email: string) {
		await this.userRepository.destroy({where: {email}})
		return true
	}
}
