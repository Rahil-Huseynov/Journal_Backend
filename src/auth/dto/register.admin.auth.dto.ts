import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterAdminAuthDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string

    @IsString()
    @IsNotEmpty()
    role:string


    @IsString()
    @IsNotEmpty()
    firstName?: string;

    @IsString()
    @IsNotEmpty()
    lastName?: string;
}