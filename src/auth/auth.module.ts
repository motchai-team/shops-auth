import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy, JwtStrategy, GoogleOauthStrategy } from './strategy';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '60s' }
        }),
        ConfigModule.forRoot()
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy, GoogleOauthStrategy, ConfigService],
    exports: [AuthService],
    controllers: [AuthController]
})
export class AuthModule {}
