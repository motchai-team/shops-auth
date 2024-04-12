import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from 'src/persistants/pg/entities/account.entity';
import { ConfigService } from '@nestjs/config';
import jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,

        @InjectRepository(Account)
        private accountRepo: Repository<Account>
    ) {}

    async validateUserLocalStrategy(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(username);
        if (user && user.password === pass) {
            user;
        }
        return null;
    }

    async loginLocalStrategy(user: any) {
        const payload = { username: user.username, sub: user.userId };
        return {
            access_token: this.jwtService.sign(payload)
        };
    }

    async googleLoginCallback(userCallback: any): Promise<any> {
        const { provider, providerId, name, username } = userCallback;
        let account = await this.accountRepo.findOne({
            where: {
                provider,
                name,
                providerUsername: username
            }
        });

        if (!account) {
            account = this.accountRepo.create({
                providerId,
                provider,
                name,
                email: username,
                providerUsername: username
            });

            await account.save();
        }

        const { id: accountId, email } = account;

        return this.generateTokens({ accountId, email, username });
    }

    public generateTokens(data: { accountId: string; email: string; username: string }) {
        const jwtSecret = this.configService.get<string>('JWT_SECRET');
        const accessExpiresIn = Number(this.configService.get<string>('JWT_ACCESS_EXPIRES_IN'));

        return {
            access_token: jwt.sign(data, jwtSecret, { expiresIn: accessExpiresIn })
        };
    }
}
