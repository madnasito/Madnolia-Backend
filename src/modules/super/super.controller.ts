import { Controller, Delete, UseGuards, Request } from '@nestjs/common';
import { UserGuard } from 'src/common/guards/user.guard';
import { SuperService } from './super.service';

@Controller('super')
export class SuperController {
  constructor(private readonly superService: SuperService) {}
  @Delete('user')
  @UseGuards(UserGuard)
  deleteUserFromDb(@Request() req: any) {
    return this.superService.deleteUser(req.user.id);
  }
}
