import { Controller, Delete, UseGuards, Request, Body } from '@nestjs/common';
import { UserGuard } from 'src/common/guards/user.guard';
import { SuperService } from './super.service';
import { UserPasswordDto } from './dto/user-password.dto';

@Controller('super')
export class SuperController {
  constructor(private readonly superService: SuperService) {}
  @Delete('user')
  @UseGuards(UserGuard)
  deleteUserFromDb(@Request() req: any, @Body() body: UserPasswordDto) {
    return this.superService.deleteUser(req.user.id, body.password);
  }
}
