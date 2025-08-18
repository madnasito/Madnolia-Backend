import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/sign-up.dtio';
import { SignInDto } from './dtos/sign-in.dto';
import { AuthResponseDto } from './dtos/response.dto';
import { AuthSerialize } from 'src/common/interceptors/auth.interceptor';
import { EmailDto } from './dtos/reset-password.dto';
import { UserGuard } from 'src/common/guards/user.guard';
import { UpdatePasswordDto } from './dtos/update-password.dto';

@Controller('auth')
@AuthSerialize(AuthResponseDto)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() body: SignUpDto) {
    return await this.authService.signUp(body);
  }

  @Post('sign-in')
  async signin(@Body() body: SignInDto) {
    return await this.authService.signIn(body);
  }

  @Get('recover-password-email')
  recoverPasswordEmail(@Body() body: EmailDto) {
    return this.authService.recoverPasswordEmail(body);
  }

  @Patch('update-password')
  @UseGuards(UserGuard)
  updatePassword(@Request() req: any, @Body() body: UpdatePasswordDto) {
    return this.authService.updatePassword(body, req.user.id);
  }
}
