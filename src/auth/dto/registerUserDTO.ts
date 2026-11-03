import { IsEmail, IsString, IsNotEmpty, IsStrongPassword, IsEnum, IsOptional } from "class-validator"
import { Role } from "../../user/user.types.js";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterUserDTO {

    @ApiProperty({ example: 'John', description: 'First name of the User' })
    @IsString()
    @IsNotEmpty()
    fname: string;

    @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
    @IsString()
    lname: string;

    @ApiProperty({ example: 'john@example.com', description: 'User email address' })
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'SecureP@ss123', description: 'Strong password' })
    @IsString()
    @IsNotEmpty()
    @IsStrongPassword()
    password: string;

    @ApiProperty({ enum: Role, default: Role.STUDENT, description: 'User role (student or teacher)' })
    @IsOptional()
    @IsEnum(Role, {
        message: 'Role must be either student, teacher and admin'
    })
    @IsString()
    role: Role
}