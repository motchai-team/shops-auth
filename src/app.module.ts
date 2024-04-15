import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import typeorm from './config/typeorm';

@Module({
    imports: [
        LoggerModule.forRoot(),
        ConfigModule.forRoot({ isGlobal: true, load: [typeorm] }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => configService.get('typeorm'),
            imports: [ConfigModule]
        }),
        AuthModule,
        UsersModule
    ],
    controllers: [AppController],
    providers: []
})
export class AppModule {}
