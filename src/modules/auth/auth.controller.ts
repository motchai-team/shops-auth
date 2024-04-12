import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { GoogleOauthGuard, JwtAuthGuard } from 'src/shared/guards';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Req() req: Request) {
        return req.user;
    }

    @UseGuards(GoogleOauthGuard)
    @Get('login/google')
    googleAuth() {}

    @UseGuards(GoogleOauthGuard)
    @Get('login/google/callback')
    googleAuthCallback(@Req() req: Request, @Res() res: Response) {
        res.status(200).json({
            data: this.authService.googleLoginCallback(req.user),
            message: 'success'
        });
    }
}
