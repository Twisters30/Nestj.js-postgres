import { BadRequestException, Injectable} from '@nestjs/common';
import { UserService } from "../user/user.service";
import { CreateUserDTO } from "../user/dto";
import { AppError } from "../../common/constants/errors";
import { UserLoginDTO } from "./dto";
import * as bcrypt from 'bcrypt'
import { AuthUserResponse } from "./response";
import { TokenService } from "../token/token.service";

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly tokenService: TokenService
	) {}

	async registerUser(dto: CreateUserDTO): Promise<CreateUserDTO> {
		const existUser = await this.userService.findUserByEmail(dto.email);
		if (existUser) {
			throw new BadRequestException(AppError.USER_EXIST)
		}
		return this.userService.createUser(dto)
	}

	async loginUser(dto: UserLoginDTO): Promise<AuthUserResponse> {
		const existUser = await this.userService.findUserByEmail(dto.email);
		console.log(existUser)
		if (!existUser) {
			throw new BadRequestException(AppError.USER_NOT_EXIST)
		}
		const validatePassword = await bcrypt.compare(dto.password, (await existUser).password);
		if (!validatePassword) {
			throw new BadRequestException(AppError.WRONG_DATA)
		}
		const userData = {
			name: (await existUser).firstName,
			email: (await existUser).email
		}
		const token = await this.tokenService.generateJwtToken(userData);
		return {
			firstName: (await existUser).firstName,
			username: (await existUser).username,
			email: (await existUser).email,
			token,
		};
	}
}
