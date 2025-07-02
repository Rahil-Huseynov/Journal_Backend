import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterAuthDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string

    @IsString()
    @IsNotEmpty()
    firstName?: string;

    @IsString()
    @IsNotEmpty()
    lastName?: string;
    
    @IsString()
    @IsNotEmpty()
    fatherName?: string;
    
    @IsString()
    @IsNotEmpty()
    role?: string;

    @IsString()
    @IsNotEmpty()
    organization?: string;

    @IsString()
    @IsNotEmpty()
    position?: string;

    @IsString()
    @IsNotEmpty()
    phoneCode?: string;
    
    @IsString()
    @IsNotEmpty()
    phoneNumber?: string;
    
    @IsString()
    @IsNotEmpty()
    address?: string;
    
    @IsString()
    @IsNotEmpty()
    fin?: string;
    
    @IsString()
    @IsNotEmpty()
    idSerial?: string;

}