import { IsString, IsNotEmpty, IsEmail, Matches, IsObject } from 'class-validator';
import { IsNestedObjectNotEmpty } from '../../decorators/address.decorator';
import { Match } from '../../decorators/password.decorator';
import { Address } from './address.dto';

export  class RegisterDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/, {
    message: 'Password too weak',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @Match('password', { message: 'Password confirmation must match password' })
  passwordConfirmation: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?:\+\d{1,3}\s*)?(?:\(\d{3}\)\s*|\d{3}(?:[-\s]*)?)\d{3}(?:[-\s]*)\d{4}$/, {
    message: 'Invalid phone number format',
  })
  phone: string;

  @IsString()
  photo: string;

  @IsObject()
  @IsNestedObjectNotEmpty({ message: 'All address feilds are required for regesteration process' })
  address:Address
}