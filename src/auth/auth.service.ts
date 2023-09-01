import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import * as uuid from 'uuid';
@Injectable()
export class AuthService {
  constructor(@InjectRepository(Auth) private authRepository: Repository<Auth>, private readonly mailerService: MailerService) {}

  async create(registerDto: RegisterDto): Promise<Auth|string> {
    const existingUser = await this.authRepository.findOne({ where: { email: registerDto.email } });

    if (existingUser) {
      throw new HttpException('User with this email already exists.', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = bcrypt.hashSync(registerDto.password, 10);
    const confirmationToken = await uuid.v4();
    const confirmationLink = `${process.env.App_URL}auth/confirm?token=${confirmationToken}`;
    const newUser = await this.authRepository.create({
      ...registerDto,
      password: hashedPassword,
      address: registerDto.address.address,
      city: registerDto.address.city,
      state: registerDto.address.state,
      country: registerDto.address.country,
      zip: registerDto.address.zip,
      isActive: false,
      token: confirmationToken,
    });

    if(newUser){
      this.authRepository.save(newUser)
     // Send confirmation email
        await this.sendConfirmationEmail(
          registerDto.email,
          registerDto.username,
          'Baala',
          confirmationLink
        );
        return "User Created Successfully Just one more step to use our application!! verify your email"
     }
  }
  
  async sendConfirmationEmail(email: string, username: string, appName: string, confirmationLink: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Confirm Your Email',
      template: './confirmation', // Corresponds to the template file name in the "templates" directory
      context: {
        username,
        appName,
        confirmationLink,
      },
    });
  }

  async sendWelcomeEmail(email: string, username: string, appName: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to Our Platform!',
      template: './welcome', // Corresponds to the template file name in the "templates" directory
      context: {
        username, // Data to pass to the template
        appName,
      },
    });
  }

  async findByConfirmationToken(token: string) {
    const user = await this.authRepository.findOne({where:{token}});
    if (!user) {
      throw new HttpException('Invalid confirmation token.', HttpStatus.BAD_REQUEST);
    }

    user.isActive = true;
    user.token = null;

    await this.authRepository.save(user);
    this.sendWelcomeEmail(user.email, user.username, "Baala");
    return 'User confirmed. You can now log in.';
  }
}