import { IsEmail, IsString, IsNotEmpty, IsStrongPassword } from "class-validator"

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
}