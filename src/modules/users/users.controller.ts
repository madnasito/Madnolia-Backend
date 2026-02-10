import {
  Controller,
  Get,
  UseGuards,
  Request,
  Param,
  Put,
  Body,
  UseInterceptors,
  Post,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  HttpException,
  HttpStatus,
  BadRequestException,
  BadGatewayException,
  Logger,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserGuard } from 'src/common/guards/user.guard';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

import axios from 'axios';
import { Types } from 'mongoose';
import { MultipleMongoIdsDto } from 'src/common/dto/mutiple-mongo-ids.dto';

@Controller('user')
@Serialize(UserDto)
export class UserController {
  constructor(
    private usersService: UsersService,
    private readonly config: ConfigService,
  ) {}

  @UseGuards(UserGuard)
  @Get('search/:username')
  async search(@Request() req: any, @Param('username') username: string) {
    return this.usersService.searchUser(req.user.id, username);
  }

  @UseGuards(UserGuard)
  @Get('search-to-invite/:username')
  async searchToInvite(
    @Request() req: any,
    @Param('username') username: string,
  ): Promise<any> {
    // Especifica el tipo de retorno, si es posible
    return this.usersService.searchToInviteUser(req.user.id, username);
  }

  @Get('user-exists/:username/:email')
  async userExists(
    @Param('username') username: string,
    @Param('email') email: string,
  ) {
    return this.usersService.userExists(username, email);
  }

  @Get('info')
  @UseGuards(UserGuard)
  async getInfo(@Request() req: any) {
    return this.usersService.getInfo(req.user.id);
  }

  @Get('info/:id')
  @UseGuards(UserGuard)
  async getInfoById(@Param('id') id: Types.ObjectId, @Request() req: any) {
    return this.usersService.getUserInfo(id, req.user.id);
  }

  @Post('info/multiple')
  @UseGuards(UserGuard)
  async getMulpleUsersInfo(@Body() body: MultipleMongoIdsDto) {
    return this.usersService.getMultipleUsersInfo(body.ids);
  }

  @Get('reset-notifications')
  @UseGuards(UserGuard)
  async resetNotifications(@Request() req: any) {
    return this.usersService.resetNotifications(req.user.id);
  }

  @Put('update')
  @UseGuards(UserGuard)
  async update(@Request() req: any, @Body() body: UpdateUserDto) {
    return this.usersService.update(req.user.id, body);
  }

  @Post('update-img')
  @UseGuards(UserGuard)
  @UseInterceptors(FileInterceptor('image'))
  async uploadFile(
    @Request() req: any,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1000 * 2048 })],
      }),
    )
    image: Express.Multer.File,
  ) {
    try {
      const validExtension = ['jpg', 'png', 'jpeg', 'webp', 'gif'];
      const extension = image.mimetype.split('/')[1];
      if (!validExtension.includes(extension)) {
        throw new HttpException('NOT_VALID_EXTENSION', HttpStatus.BAD_REQUEST);
      }

      const form = new FormData();
      const apiKey = this.config.get<string>('IMGBB_KEY');

      // ...existing code...
      form.append(
        'file',
        new Blob([new Uint8Array(image.buffer)], { type: image.mimetype }),
        image.originalname,
      );

      form.append('apikey', apiKey);

      const resp = await axios.post(
        'https://beeimg.com/api/upload/file/json/',
        form,
      );

      if (
        resp.data.files.status === 'Success' ||
        resp.data.files.status === 'Duplicate'
      ) {
        const currentUser = await this.usersService.getInfo(req.user.id);
        await this.usersService.update(req.user.id, {
          name: currentUser.name,
          username: currentUser.username,
          email: currentUser.email,
          platforms: currentUser.platforms,
          availability: currentUser.availability,
          thumb: resp.data.files.thumbnail_url,
          image: resp.data.files.url,
        });
        return {
          thumb: resp.data.files.thumbnail_url,
          image: resp.data.files.url,
        }; // Return a simple JSON response
      }

      throw new BadRequestException();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Logger.error({
          message: 'Error uploading user image to BeeImg',
          status: error.response?.status,
          data: error.response?.data,
          error: error.message,
        });
      } else {
        Logger.error(error);
      }
      throw new BadGatewayException();
    }
  }
}
