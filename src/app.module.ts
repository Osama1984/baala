import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule} from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          service: 'Gmail', // Use Gmail as the email service
          auth: {
            user: process.env.GMAIL_Email, // Your Gmail email address
            pass: process.env.GMAIL_APP_PASSWORD, // Your app-specific password or OAuth2 token
          },
        },
        defaults: {
          from: '"No Reply" <noreply@example.com>',
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.Mongo_DB_URL,
      synchronize: true,
      useUnifiedTopology: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
