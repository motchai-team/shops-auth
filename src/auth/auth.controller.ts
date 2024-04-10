import { Controller, Get, Post, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleOauthGuard, JwtAuthGuard, LocalAuthGuard } from 'src/shared/guards';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Req() req: Request) {
        return this.authService.login(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Req() req: Request) {
        return req.user;
    }

    @UseGuards(GoogleOauthGuard)
    @Get('google')
    googleAuth() {}

    @UseGuards(GoogleOauthGuard)
    @Get('google/callback')
    googleAuthCallback(@Req() req: Request, @Res() res: Response) {
        res.status(200).json(req.user);
    }
}
