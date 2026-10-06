import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";

export class loginUserDTO {
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsNotEmpty()
    password: string
}