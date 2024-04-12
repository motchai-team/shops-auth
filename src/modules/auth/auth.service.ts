import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from 'src/persistants/pg/entities/account.entity';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,

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
        try {
            const { provider, providerId, name, username } = userCallback;
            let account = await this.accountRepo.findOne({
                where: {
                    provider,
                    name,
                    provider_username: username
                }
            });

            if (!account) {
                account = this.accountRepo.create({
                    provider_id: providerId,
                    provider,
                    name,
                    email: username,
                    provider_username: username
                });

                await account.save();
            }

            const { id: accountId, email } = account;

            return this.generateTokens({ accountId, email, username });
        } catch (e) {
            console.log(e);
            throw new HttpException(`error ${e}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public generateTokens(data: { accountId: string; email: string; username: string }) {
        return {
            access_token: this.jwtService.sign(data)
        };
    }
}
