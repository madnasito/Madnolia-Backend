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
        console.log(body);
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
     ) {
        const validExtension = [ 'jpg', 'jpeg', 'png'];
        const extension = img.mimetype.split('/')[1]
        if(!validExtension.includes(extension)){
            throw new HttpException('Not valid extension', HttpStatus.BAD_REQUEST);
        }

        console.log(img);

        const base64Img = Buffer.from(img.buffer).toString('base64');

        // const formData = new FormData()
        // formData.append('image', base64Img)


        
        const form = new FormData();
        form.append('file', img.destination);
        form.append("apikey", "a639124c1b9448e386cdf89e3fa4597f");

        axios.post('https://beeimg.com/api/upload/file/json/',
            form
            , {headers:
            {
                "Content-Type": "multipart/form-data; boundary=<calculated when request is sent>"
            }
        } )
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error(error);
        });
        
    }


}
