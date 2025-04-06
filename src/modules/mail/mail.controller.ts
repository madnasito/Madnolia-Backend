import { Body, Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('')
  async resetPassword(@Body() body: ResetPasswordDto) {
    return await this.mailService.sendEmail(
      'Reset password',
      'signup-confirmation-email',
      body.email,
    );
  }
}
