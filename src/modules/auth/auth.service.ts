import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from 'src/persistants/pg/entities/account.entity';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,

        @InjectRepository(Account)
        private accountRepo: Repository<Account>
    ) {}

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

            return this.generateTokens({ accountId, email });
        } catch (e) {
            throw new HttpException(`error ${e}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public generateTokens(data: { accountId: string; email: string }) {
        return {
            access_token: this.jwtService.sign(data)
        };
    }
}
