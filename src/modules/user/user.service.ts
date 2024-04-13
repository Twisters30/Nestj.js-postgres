import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./models/user.model";
import * as bcrypt from 'bcrypt'
import {CreateUserDTO, UpdateUserDTO} from "./dto";
import {Watchlist} from "../watchlist/models/watchlist.model";

type TUser = {
	firstName: string;
	username: string;
	email: string;
	password: string;
}

@Injectable()
export class UserService {
	constructor(
		@InjectModel(User) private readonly userRepository: typeof User) {}

	async hashPassword(password: string): Promise<string> {
		try {
			return bcrypt.hash(password, 10)
		} catch (error) {
			throw new Error(error);
		}
	}
	async findUserByEmail(email: string): Promise<User> {
		try {
			return this.userRepository.findOne({rejectOnEmpty: undefined, where: { email } });
		} catch (error) {
			throw new Error(error);
		}
	}

	async publicUser (email: string): Promise<User> {
		try {
			return await this.userRepository.findOne({
				where: {email},
				attributes: {exclude: ['password']},
				include: {
					model: Watchlist,
					required: false
				},
			})
		} catch (error) {
			throw new Error(error);
		}
	}

	async createUser(dto: CreateUserDTO): Promise<CreateUserDTO> {
		try {
			dto.password = await this.hashPassword(dto.password);
			const newUser: TUser = {
				firstName: dto.firstName,
				username: dto.username,
				email: dto.email,
				password: dto.password
			}
			await this.userRepository.create(newUser);
			return newUser;
		} catch (error) {
			throw new Error(error);
		}
	}
	async updateUser(email: string, dto: UpdateUserDTO): Promise<UpdateUserDTO> {
		try {
			await this.userRepository.update(dto, {returning: undefined, where: {email}});
			return dto;
		} catch (error) {
			throw new Error(error);
		}
	}

	async deleteUser(email: string): Promise<boolean> {
		try {
			await this.userRepository.destroy({where: {email}})
			return true
		} catch (error) {
			throw new Error(error);
		}
	}
}
