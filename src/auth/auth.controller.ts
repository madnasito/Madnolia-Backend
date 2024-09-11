import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/sign-up.dtio';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService){}

    @Post("sign-up")
    async signUp(@Body() body: SignUpDto){
        return await this.authService.signup(body);
    }
    
}
