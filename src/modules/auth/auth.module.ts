import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy, GoogleOauthStrategy } from './strategy';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from 'src/persistants/pg/entities';

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            imports: [ConfigModule],

            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '60s' }
            })
        }),
        TypeOrmModule.forFeature([...entities])
    ],
    providers: [AuthService, JwtStrategy, GoogleOauthStrategy, ConfigService],
    exports: [AuthService],
    controllers: [AuthController]
})
export class AuthModule {}
