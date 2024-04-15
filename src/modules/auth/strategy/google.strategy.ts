import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Profile, Strategy } from 'passport-google-oauth20';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy, 'google') {
    private logger = new Logger(GoogleOauthStrategy.name);

    constructor(configService: ConfigService) {
        super({
            clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
            clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
            callbackURL: configService.get<string>('GOOGLE_CLIENT_CALLBACK_URL'),
            scope: ['email', 'profile', 'openid']
        });
    }

    async validate(_accessToken: string, _refreshToken: string, profile: Profile) {
        const { id, name, emails } = profile;
        this.logger.log(`[Login] profile: ${profile}`);

        return {
            provider: 'google',
            providerId: id,
            name: name.givenName,
            username: emails[0].value
        };
    }
}
