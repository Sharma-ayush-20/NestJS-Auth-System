import { IsEmail, IsString, IsNotEmpty } from "class-validator"

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
    password: string;
}