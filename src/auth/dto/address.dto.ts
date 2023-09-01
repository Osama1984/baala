import { IsNotEmpty, IsString, Matches } from "class-validator"

export class Address{
    @IsString()
    @IsNotEmpty()
    address:string
  
    @IsString()
    @IsNotEmpty()
    city:string
  
    @IsString()
    @IsNotEmpty()
    state:string
  
    @IsString()
    @IsNotEmpty()
    country:string
  
    @IsString()
    @IsNotEmpty()
    @Matches(/^[0-9]{5}$/, {
      message: 'ZIP code must be a valid 5-digit number',
    })
    zip:string
  }
  