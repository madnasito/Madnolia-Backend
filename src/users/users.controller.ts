import { Controller, Get, UseGuards, Request, Param, Put, Body, UseInterceptors, Post, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserGuard } from 'src/guards/user.guard';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Controller('user')
@Serialize(UserDto)
export class UserController {

    constructor(
        private usersService: UsersService,
        private readonly config: ConfigService,
    ){}

    @Get('search/:username')
    async search(@Param('username') username: string) {
        return this.usersService.searchUser(username);
    }

    @Get('user-exists/:username/:email')
    async userExists(@Param('username') username:string, @Param('email') email: string){
        return this.usersService.userExists(username, email);
    }

    @Get('info')
    @UseGuards(UserGuard)
    async getInfo(@Request() req:any) {
        return this.usersService.getInfo(req.user.id);
    }


    @Get('reset-notifications')
    @UseGuards(UserGuard)
    async resetNotifications(@Request() req:any) {
        return this.usersService.resetNotifications(req.user.id)
    }

    @Get('user-partners')
    @UseGuards(UserGuard)
    async userPartners(@Request() req: any) {
        return this.usersService.getUserPartners(req.user.id)
    }

    @Put('update')
    @UseGuards(UserGuard)
    async update(@Request() req:any, @Body() body:UpdateUserDto) {
        return this.usersService.upadte(req.user.id, body)
    }

    @Post('upload')
    @UseGuards(UserGuard)
    @UseInterceptors(FileInterceptor('img'))
    async uploadFile(
        @Request() req:any,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 2000 * 1024 }), // 2MB max size
                ],
            })
        ) img: Express.Multer.File,
     ):Promise<any> {
        const validExtension = [ 'jpg', 'jpeg', 'png'];
        const extension = img.mimetype.split('/')[1]
        if(!validExtension.includes(extension)){
            throw new HttpException('Not valid extension', HttpStatus.BAD_REQUEST);
        }

        const base64Img = Buffer.from(img.buffer).toString('base64');

        const formData = new FormData()
        formData.append('image', base64Img)

        const imgBbKey = this.config.get<string>('IMGBB_KEY')
        
        await axios.post(`https://api.imgbb.com/1/upload?key=${imgBbKey}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }).then(async(resp) => {
            console.log(resp);
            await this.usersService.upadte(req.user.id, {
                
                img: resp.data.data.url,
                thumb: resp.data.data.thumb.url
            });
            return resp;
        }).catch((error) => new HttpException(error, HttpStatus.BAD_REQUEST))
        
    }


}
