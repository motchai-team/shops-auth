import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
    @Get('/ping')
    async login() {
        return 'pong';
    }
}
