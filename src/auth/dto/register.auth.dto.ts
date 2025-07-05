import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsBoolean,
  ValidateIf,
} from "class-validator";
import { Transform } from "class-transformer";

export class RegisterAuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName?: string;

  @IsString()
  @IsNotEmpty()
  lastName?: string;

  @IsString()
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

  @IsBoolean()
  @Transform(({ value }) => value === "true" || value === true)
  isForeignCitizen: boolean;

  @ValidateIf((o) => !o.isForeignCitizen)
  @IsString()
  @IsNotEmpty()
  fin: string;

  @ValidateIf((o) => !o.isForeignCitizen)
  @IsString()
  @IsNotEmpty()
  idSerial: string;

  @ValidateIf((o) => o.isForeignCitizen)
  @IsString()
  @IsNotEmpty()
  passportId?: string | null;

  @IsString()
  @IsNotEmpty()
  citizenship?: string;
}
