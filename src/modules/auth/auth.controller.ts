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
    async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
        const token = await this.authService.googleLoginCallback(req.user);
        res.status(200).json({
            data: token,
            message: 'success'
        });
    }
}
