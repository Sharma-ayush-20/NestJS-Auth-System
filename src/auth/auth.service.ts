import {
    BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service.js';
import { RegisterUserDTO } from './dto/registerUserDTO.js';
import { loginUserDTO } from './dto/loginUserDTO.js';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../user/user.types.js';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  //register the new user
  async registerService(registerUserdto: RegisterUserDTO) {
    const { fname, lname, email, password } = registerUserdto;

    if (registerUserdto.role === Role.ADMIN) {
      throw new BadRequestException('Cannot register as an Admin');
    }

    //check if user already exists
    const user = await this.userService.findByEmail(email);

    if (user) {
      throw new ConflictException('User already exists. Sign In');
    }

    //hash the password
    const hashPassword = await bcrypt.hash(password, 10);

    const response = await this.userService.CreateUser({
      ...registerUserdto,
      password: hashPassword,
    });

    const payload = { sub: response.data._id, role: response.data.role };
    const token = await this.jwtService.signAsync(payload);
    return {
      token: token,
      message: response.message,
      data: response.data,
    };
  }

  //login the user
  async loginService(loginUserdto: loginUserDTO) {
    //authenticated part only
    const { email, password } = loginUserdto;

    // email existed or not
    const existedEmail = await this.userService.findByEmail(email);

    if (!existedEmail) {
      throw new UnauthorizedException('Invalid email or password');
    }

    //password checking
    const isMatchPassword = await bcrypt.compare(
      password,
      existedEmail.password,
    );

    if (!isMatchPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }

    //create a jwt token
    const payload = { sub: existedEmail._id, role: existedEmail.role };
    const token = await this.jwtService.signAsync(payload);

    const loginUser = await this.userService.loginUser(existedEmail);

    return {
      status: 200,
      message: 'User login Successfully.',
      token: token,
      data: loginUser,
    };
  }
}
