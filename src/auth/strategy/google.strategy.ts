import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Profile, Strategy } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        configService: ConfigService
        // private readonly usersService: UsersService
    ) {
        super({
            clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
            clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
            callbackURL: configService.get<string>('GOOGLE_CLIENT_CALLBACK_URL'),
            scope: ['email', 'profile']
        });
    }

    async validate(_accessToken: string, _refreshToken: string, profile: Profile) {
        const { id, name, emails } = profile;

        return {
            provider: 'google',
            providerId: id,
            name: name.givenName,
            username: emails[0].value
        };
    }
}
