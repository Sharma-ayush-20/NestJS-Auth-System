import { IsEmail, IsString, IsNotEmpty, IsStrongPassword, IsEnum, IsOptional } from "class-validator"
import { Role } from "../../user/user.types.js";

export class RegisterUserDTO {

    @IsString()
    @IsNotEmpty()
    fname: string;

    @IsString()
    lname: string;

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @IsStrongPassword()
    password: string;

    @IsOptional()
    @IsEnum(Role, {
        message: 'Role must be either student, teacher and admin'
    })
    @IsString()
    role: Role
}