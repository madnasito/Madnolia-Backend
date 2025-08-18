import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly usersService: UsersService,
  ) {}

  async sendEmail(
    subject: string,
    template: string,
    to: string,
    context?: any,
  ) {
    try {
      const user = await this.usersService.findOneByEmail(to);

      if (!user) {
        return { ok: true };
      }

      const emailsList: string[] = [to];

      const mailContext: ISendMailOptions['context'] = {
        name: user.name,
        ...context,
      };

      const sendMailParams: ISendMailOptions = {
        to: emailsList,
        subject,
        template,
        context: mailContext,
      };
      const response = await this.mailerService.sendMail(sendMailParams);
      this.logger.debug(
        `Email sent successfully to recipients with the following parameters : ${JSON.stringify(
          sendMailParams,
        )}`,
        response,
      );
      return { ok: true };
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException();
    }
  }

  async sendPasswordRecoveryEmail(email: string, token: string) {
    return this.sendEmail(
      'Password Recovery Instructions',
      'recover-password-email', // This should match your template file name without extension
      email,
      { token },
    );
  }
}
