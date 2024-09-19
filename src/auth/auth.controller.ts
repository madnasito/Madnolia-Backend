import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/sign-up.dtio';
import { SignInDto } from './dtos/sign-in.dto';

@Controller('auth')

export class AuthController {

    constructor(private authService: AuthService){}

    @Post("sign-up")
    async signUp(@Body() body: SignUpDto) {
        console.log(typeof body);
        return await this.authService.signUp(body);
    }

    @Post('sign-in')
    async signin(@Body() body: SignInDto) {
        return await this.authService.signIn(body);
    }
    
}
