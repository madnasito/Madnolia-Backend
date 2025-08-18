import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SignUpDto } from './dtos/sign-up.dtio';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dtos/sign-in.dto';
import { UsersService } from '../users/users.service';
import { EmailDto } from './dtos/reset-password.dto';
import { MailService } from '../mail/mail.service';
import { Types } from 'mongoose';
import { UpdatePasswordDto } from './dtos/update-password.dto';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private mailService: MailService,
  ) {}

  signUp = async (signUpDto: SignUpDto) => {
    signUpDto.username = signUpDto.username.toLowerCase();
    const createdUser = await this.usersService.create(signUpDto);

    const payload = { id: createdUser._id };
    const token = await this.jwtService.signAsync(payload);
    return {
      user: createdUser,
      token,
    };
  };

  signIn = async (signInDto: SignInDto) => {
    const user = await this.usersService.fincOneByUsername(
      signInDto.username.toLocaleLowerCase(),
    );

    if (!user) throw new NotFoundException('USER_NOT_FOUND');

    const isMatch = await compare(signInDto.password, user.password);

    if (!isMatch) throw new BadRequestException('WRONG_PASSWORD');

    const payload = { id: user._id };
    const token = await this.jwtService.signAsync(payload);

    return {
      user,
      token,
    };
  };

  recoverPasswordEmail = async (body: EmailDto) => {
    const userData = await this.usersService.findOneByEmail(body.email);

    if (!userData) return { ok: true };

    const payload = { id: userData._id };
    const token = await this.jwtService.signAsync(payload, { expiresIn: '1h' });

    return this.mailService.sendPasswordRecoveryEmail(userData.email, token);
  };

  updatePassword = (body: UpdatePasswordDto, id: Types.ObjectId) => {
    return this.usersService.updatePassword(body.password, id);
  };
}
