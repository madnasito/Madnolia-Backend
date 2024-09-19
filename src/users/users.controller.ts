import { Controller, Get, UseGuards, Request, Param, Put, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserGuard } from 'src/guards/user.guard';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';

@Controller('user')
@Serialize(UserDto)
export class UserController {

    constructor(private usersService: UsersService){}

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

}
